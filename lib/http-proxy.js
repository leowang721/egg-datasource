'use strict';

// const qs = require('querystring');
const convert = require('koa-convert');
const proxy = require('koa-proxy');
// const bodyParser = require('koa-bodyparser');
const util = require('./util');

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
  // const bodyParserProcessor = bodyParser();
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

      await processor(ctx, next);
    } else {
      await next();
    }
  };
};
