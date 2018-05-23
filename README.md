# Koa Joi Validator

A simple validator for koa 2 application, inspired from [koa-joi-validator](https://github.com/vanwalj/koa-joi-validator), with Typescript supported

## API

A koa middleware which will validate and transform the request

| param | type | required | description |
|-------|------|------------------|-------------|
| options | object | true | |
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
  validator.validate({
    type: 'json',
    params: {
      number: Joi.number().required(),
      string: Joi.string().required(),
      date: Joi.date().required()
    },
    body: {
      number: Joi.number().required(),
      string: Joi.string().required(),
      date: Joi.date().required()
    },
    headers: Joi.object({
      number: Joi.number().required(),
      string: Joi.string().required(),
      date: Joi.date().required()
    }).options({ allowUnknown: true }),
    query: {
      number: Joi.number().required(),
      string: Joi.string().required(),
      date: Joi.date().required()
    }
  }),
  (ctx) => {
    this.assert(typeof this.params.number === 'number');
    this.assert(typeof this.params.string === 'string');
    this.assert(this.params.date instanceof Date);

    ['body', 'headers', 'query'].forEach(el => {
      this.assert(typeof this.request[el].number === 'number');
      this.assert(typeof this.request[el].string === 'string');
      this.assert(this.request[el].date instanceof Date);
    });

    this.status = 204;
  }
);
```
