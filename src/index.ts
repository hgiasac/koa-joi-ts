import * as Joi from "joi";
import { Context } from "koa";
import * as parser from "co-body";

export type FailureCallback = (ctx: Context, err: Joi.ValidationError) => any;
export type ValidateFunction = 
  (value: any, schema: Joi.SchemaLike, options: Joi.ValidationOptions) => Promise<any>;

export interface IParserOptions {
  limit: string;
  strict: boolean;
  returnRawBody: boolean;
}

export enum KoaJoiValidatorType {
  Json = "json",
  Form = "form",
  Text = "text",
}
export interface IKoaJoiValidatorOptions {
  type?: KoaJoiValidatorType;
  failure?: number | FailureCallback;
  options?: Joi.ValidationOptions;
  body?: Joi.SchemaLike;
  params?: Joi.SchemaLike;
  headers?: Joi.SchemaLike;
  query?: Joi.SchemaLike;
  parserOptions?: IParserOptions;
}

function parseBody(
  ctx: Context, options: IKoaJoiValidatorOptions): Promise<any> {

  const parserOptions = { ...options.parserOptions };

  switch (options.type) {
    case KoaJoiValidatorType.Json:
      return parser.json(ctx, parserOptions);
    case KoaJoiValidatorType.Form:
      return parser.form(ctx, parserOptions);
    case KoaJoiValidatorType.Text:
      return parser.text(ctx, parserOptions);
    default: 
      return parser(ctx, parserOptions);
  }

}

export function KoaJoiValidator(options: IKoaJoiValidatorOptions) {
  
  const opts = {
    type: KoaJoiValidatorType.Json,
    failure: 400,
    ...options,
  };

  return async (ctx: Context, next: () => any) => {

    try {
      

      if (opts.body) {
        const body = await parseBody(ctx, opts);
        
        (<any> ctx.request).body = await Joi.validate(
          body, opts.body, opts.options
        );

      }

      if (opts.headers) {
        await Joi.validate(ctx.header, opts.headers, opts.options);
      }

      if (opts.query) {
        ctx.query = await Joi.validate(ctx.query, opts.query, opts.options)
          .then((results) => ({ ...ctx.query, ...results }));
      }

      if (opts.params) {
        ctx.params = await Joi.validate(ctx.params, opts.params, opts.options)
          .then((results) => ({ ...ctx.params, ...results })); 
      }

      return next();

    } catch (e) {
      if (typeof opts.failure === "function") {
        
        return opts.failure(ctx, e);
      }

      ctx.status = opts.failure;
      ctx.body = {
          message: e.message,
          errors: e.details
      };
    }
  }
}
