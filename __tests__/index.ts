import * as Koa from "koa";
import * as request from "supertest";
import * as Router from "koa-router";
import * as Joi from "joi";
import "jest";
import { KoaJoiValidator } from "../src";

const app = new Koa();
const router = new Router();

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

app.use(router.allowedMethods());
app.use(router.routes());


describe("Validation test", () => {

  const server = app.listen(30000);

  afterAll(() => {
    server.close();
  });

  it("Get all Institutes", (done) => {


    return request(server).post("/12/hello/2013-03-01T01:10:00?number=12&string=hello&date=2013-03-01T01:10:00")
      .send({
        number: 12,
        string: 'hello',
        date: new Date()
      })
      .set("number", "12")
      .set("string", "hello")
      .set("date", new Date().toISOString())
      .expect(204)
      .end(done);
  });

});
