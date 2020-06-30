'use strict';

module.exports = {
  isApi(path) {
    return /^\/api\//.test(path);
  },
  getMatchRegExp(key) {
    if (key === 'default') {
      return /\/api\//;
    }
    return new RegExp(`^\/api\/@${key}\/`);
  },
  getHost(conf) {
    const protocol = conf.protocol || 'http';
    let host = `${protocol}://${conf.host}`.replace(/\/+$/, '');
    if (conf.port) {
      host += `:${conf.port}`;
    }
    return host;
  },
  getPath(conf) {
    return `${(conf.path || '')}/`.replace(/\/+$/, '/');
  },
  getHook(conf) {
    const cb = () => {};
    const { onStart = cb, onEnd = cb } = conf;
    return { onStart, onEnd };
  },
};
