'use strict';

const mock = require('egg-mock');

describe('test/datasource.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/datasource-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, datasource')
      .expect(200);
  });
});
