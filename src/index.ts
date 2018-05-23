import * as Joi from "joi";
import { Context } from "koa";

export type FailureCallback = (ctx: Context, err: Joi.ValidationError) => any;
export type ValidateFunction = (value: any, schema: Joi.SchemaLike, options: Joi.ValidationOptions) => Promise<any>;

export interface IKoaJoiValidatorOptions {
  type?: "json" | "form" | "text";
  failure?: number | FailureCallback;
  options?: Joi.ValidationOptions;
  body?: Joi.SchemaLike;
  params?: Joi.SchemaLike;
  headers?: Joi.SchemaLike;
  query?: Joi.SchemaLike;
}

export function KoaJoiValidator(options: IKoaJoiValidatorOptions) {
  
  const opts = {
    type: "json",
    failure: 400,
    ...options,
  };

  return async (ctx: Context, next: () => any) => {

    try {
      if (opts.body) {
        ctx.body = await Joi.validate(ctx.body, opts.body, opts.options);
      }

      if (opts.headers) {
        await Joi.validate(ctx.header, opts.body, opts.options);
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
      if (typeof opts.failure === "number") {
        return ctx.throw(opts.failure, e);
      }
      
      return opts.failure(ctx, e);
    }
  }
}
