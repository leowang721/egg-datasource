'use strict';

const proxy = require('koa-proxy');
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
  const processor = proxy(opts);
  return function* httpProxy(next) {
    if (util.isApi(this.path)) {
      this.logger.info(`[proxy http] TO ${opts.host}${opts.map(this.path)}`);
      // add token
      if (this.session && this.session.token) {
        this.request.header.token = this.session.token;
      }
    }
    return yield processor.call(this, next);
  };
};
