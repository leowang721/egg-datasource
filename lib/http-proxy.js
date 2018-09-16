'use strict';

const qs = require('querystring');
const convert = require('koa-convert');
const proxy = require('koa-proxy');
const bodyParser = require('koa-bodyparser');
const util = require('./util');

const multipart = (ctx, processor, next) => {
  const body = [];

  ctx.req.on('data', chunk => {
    body.push(chunk);
  });

  ctx.req.on('end', async () => {
    ctx.request.body = Buffer.concat(body).toString();
    await processor(ctx, next);
  });
};

module.exports = (key, conf) => {
  const matchReg = util.getMatchRegExp(key);
  const toUseHost = util.getHost(conf);
  const toUsePath = util.getPath(conf);

  const opts = {
    jar: true, // use cookie
    host: toUseHost,
    match: matchReg,
    map(path) {
      return path.replace(matchReg, toUsePath);
    },
  };
  const bodyParserProcessor = bodyParser();
  const processor = convert(proxy(opts));
  return async function httpProxy(ctx, next) {
    if (util.isApi(ctx.path)) {
      ctx.logger.info(`[proxy http] TO ${opts.host}${opts.map(ctx.path)}`);
      // add token
      if (conf.patchHeader) {
        if (ctx.session && ctx.session.token) {
          ctx.request.header.token = ctx.session.token;
        }
      }

      if (ctx.req.method.toUpperCase() !== 'GET') {
        if (ctx.request.header['content-type'].indexOf('multipart/') === 0) {
          await multipart(ctx, processor, next);
          return;
        }

        await bodyParserProcessor(ctx, async () => {
          // bodyParser 处理 x-www-form-urlencoded 类型会转为 Object，value 为 字符串
          // 但后续的 proxy 处理不了，所以先硬转一次
          if (ctx.request.header['content-type'] === 'application/x-www-form-urlencoded' && typeof ctx.request.body === 'object') {
            ctx.request.body = qs.stringify(ctx.request.body);
          }

          await processor(ctx, next);
        });
      } else {
        await processor(ctx, next);
      }
    } else {
      await next();
    }
  };
};
