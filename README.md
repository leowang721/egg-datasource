# egg-datasource

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-datasource.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-datasource
[travis-image]: https://img.shields.io/travis/eggjs/egg-datasource.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-datasource
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-datasource.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-datasource?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-datasource.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-datasource
[snyk-image]: https://snyk.io/test/npm/egg-datasource/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-datasource
[download-image]: https://img.shields.io/npm/dm/egg-datasource.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-datasource

<!--
Description here.
-->

## Install

```bash
$ npm i egg-datasource --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.datasource = {
  enable: true,
  package: 'egg-datasource',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.datasource = {
  projectName: {
    mocking: false, // 是否开启mock模式
    mockUrl: 'https://test.com', // mock url
    protocol: 'http', // 正式使用的协议
    host: 'data.com',
    port: '8080',
    path: '',
    onStart(ctx) { // 代理请求前钩子
      // ...
    },
    onEnd(ctx) { // 代理请求后钩子
      // ...
    }
  }
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/leowang721/egg-datasource/issues).

## License

[MIT](LICENSE)
