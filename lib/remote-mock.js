'use strict';

const { URL } = require('url');
const proxy = require('koa-proxy');
const util = require('./util');

module.exports = (key, remoteUrl) => {
  const matchReg = util.getMatchRegExp(key);
  const parsedUrl = new URL(remoteUrl);
  const toUseHost = parsedUrl.origin;
  const toUsePath = parsedUrl.pathname;

  const opts = {
    jar: true, // use cookie
    host: toUseHost,
    match: matchReg,
    map(path) {
      return path.replace(matchReg, toUsePath);
    },
  };
  const processor = proxy(opts);
  return function* remoteMock(next) {
    if (util.isApi(this.path)) {
      this.logger.info(`[proxy http] TO ${opts.host}${opts.map(this.path)}`);
    }
    return yield processor.call(this, next);
  };
};
