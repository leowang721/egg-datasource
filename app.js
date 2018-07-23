'use strict';

const path = require('path');
const localMock = require('./lib/local-mock');
const httpProxy = require('./lib/http-proxy');
const remoteMock = require('./lib/remote-mock');

function useMiddleware(app, k, conf) {
  if (typeof conf === 'string') {
    // 本地 mock，支持 .js/.json
    const targetPath = path.join(app.baseDir, conf);
    app.use(localMock(k, targetPath));
  } else if (typeof conf === 'object') {
    if (!conf.protocol || /http[s]?/.test(conf.protocol)) {
      // http proxy
      if (conf.mocking === true && conf.mockUrl) {
        app.use(remoteMock(k, conf.mockUrl));
      } else {
        app.use(httpProxy(k, conf));
      }
    } else {
      // thrift
    }
  }
}

module.exports = app => {
  const config = app.config.datasource;

  for (const k in config) {
    if (Object.prototype.hasOwnProperty.call(config, k) && k !== 'default') {
      useMiddleware(app, k, config[k]);
    }
  }

  // 最后 use default
  if (config.default) {
    useMiddleware(app, 'default', config.default);
  }
};
