const PassThrough = require('stream').PassThrough;

function getQuickChunk(item, method, callback) {
  const stream = new PassThrough();
  lorg.pipe(stream);

  setImmediate(() => lorg[method](item));

  stream.once('data', (chunk) => {
    let object = JSON.parse(chunk.toString('utf8'));
    callback(object);
  });
}

describe("Lorg interface test suite", function () {
  it("should be a correct instance", function () {
    expect(lorg).to.be.an.instanceOf(PassThrough);
    expect(lorg).to.have.property('log');
    expect(lorg).to.have.property('warn');
    expect(lorg).to.have.property('error');
    expect(lorg).to.have.property('trace');
  });

  it("should pipe to a new stream", function (done) {
    const stream = new PassThrough();
    stream.once('data', () => done());
    lorg.pipe(stream);
    setImmediate(() => lorg.log({ test: true }));
  });
  
  it("should log in correct format", function (done) {
    const stream = new PassThrough();
    lorg.pipe(stream);

    setImmediate(() => lorg.log({ test: true }));

    stream.once('data', (chunk) => {
      let object = JSON.parse(chunk.toString('utf8'));
      expect(object).to.have.property('test', true);
      expect(object).to.have.property('_META_');
      done();
    });
  });

  it("should set the correct log meta", function (done) {
    const stream = new PassThrough();
    lorg.pipe(stream);

    setImmediate(() => lorg.log({ test: true }));

    stream.once('data', (chunk) => {
      let object = JSON.parse(chunk.toString('utf8'));
      expect(object).to.have.property('test', true);
      expect(object).to.have.property('_META_');
      expect(object._META_).to.have.property('time');
      expect(object._META_).to.have.property('type', 'log');
      done();
    });
  });

  it("should correctly log with warn type", function (done) {
    getQuickChunk({ test: true }, 'warn', (object) => {
      expect(object).to.have.property('test', true);
      expect(object).to.have.property('_META_');
      expect(object._META_).to.have.property('type', 'warn');
      done();
    });
  });

  it("should correctly log with error type", function (done) {
    getQuickChunk({ test: true }, 'error', (object) => {
      expect(object).to.have.property('test', true);
      expect(object).to.have.property('_META_');
      expect(object._META_).to.have.property('type', 'error');
      done();
    });
  });

  it("should correctly handle trace types", function (done) {
    getQuickChunk(new Error('test'), 'trace', (object) => {
      expect(object).to.have.property('message', 'test');
      expect(object).to.have.property('stack');
      expect(object).to.have.property('_META_');
      expect(object._META_).to.have.property('type', 'trace');
      done();
    });
  });

  it("should log with shorthand properties", function (done) {
    const text = "Hello World!";

    getQuickChunk({ text }, 'log', (object) => {
      expect(object).to.have.property('text', text);
      expect(object).to.have.property('_META_');
      expect(object._META_).to.have.property('type', 'log');
      done();
    });
  });
});