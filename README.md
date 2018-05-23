# Koa Joi Validator

A simple validator for koa 2 application, inspired from [koa-joi-validator](https://github.com/vanwalj/koa-joi-validator), with Typescript supported

## API

A koa middleware which will validate and transform the request

| param | type | required | description |
|-------|------|------------------|-------------|
| options | object | true | |
| options.type | string | Default to `json` | the coBody parser to call, can be json form or text |
| options.failure | int | (ctx: Context, err: ValidationError) => any | false | The error code or function to throw on case of validation error, default to 400 |
| options.options | {} | false | Options passed to Joi validator, such as `allowUnknown` |
| options.body | Joi.object | false | A joi schema validated against the request body | 
| options.params | Joi.object | false | A joi schema validated against the request params | 
| options.headers | Joi.object | false | A joi schema validated against the request headers | 
| options.query | Joi.object | false | A joi schema validated against the request query | 

## Requirement
- NodeJS >= 7.6 is required.
- Joi

## Installation

Install using [npm](https://www.npmjs.org/):

```sh
npm install koa2-joi-validator joi
```


## Usage

``` es6
import { KoaJoiValidator } from "koa2-joi-validator";
import * as Joi from "joi";


router.post('/:number/:string/:date',
  KoaJoiValidator({
    type: 'json',
    params: {
      number: Joi.number().required(),
      string: Joi.string().required(),
      date: Joi.string().isoDate().required()
    },
    body: {
      number: Joi.number().required(),
      string: Joi.string().required(),
      date: Joi.string().isoDate().required()
    },
    headers: Joi.object({
      number: Joi.number().required(),
      string: Joi.string().required(),
      date: Joi.string().isoDate().required()
    }).options({ allowUnknown: true }),
    query: {
      number: Joi.number().required(),
      string: Joi.string().required(),
      date: Joi.string().isoDate().required()
    },
    failure(ctx: Koa.Context, err: Joi.ValidationError) {
      console.log(err);
      ctx.throw(400);
      
    }
  }),
  (ctx: Koa.Context) => {
    expect(typeof ctx.params.number === 'number');
    expect(typeof ctx.params.string === 'string');
    expect(ctx.params.date instanceof Date);

    ['body', 'headers', 'query'].forEach((el) => {
      expect(typeof ctx.request[el].number === 'number');
      expect(typeof ctx.request[el].string === 'string');
      expect(ctx.request[el].date instanceof Date);
    });

    ctx.status = 204;
  },
  
);
```
