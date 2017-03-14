const PassThrough = require('stream').PassThrough;
const Writable = require('stream').Writable;
const os = require('os');

class Lorg extends PassThrough {
  constructor(options) {
    super(options);

    this._filter = null;
  }

  _create(type, item) {
    if (this._filter && (type !== this._filter)) return;
    // Extend item with Metadata
    item._META_ = {
      time: Date.now(),
      type: type
    };
    // Write buffer to stream with prefix template
    this.write(`${JSON.stringify(item)}${os.EOL}`);
  }

  /*
  filter(type) {
    this._filter = type;
  }

  reset() {
    this._filter = null;
  }*/

  log(item) {
    this._create("log", item);
  }

  warn(item) {
    this._create("warn", item);
  }

  error(item) {
    this._create("error", item);
  }

  trace(error) {
    this._create("trace", { message: error.message, stack: error.stack });
  }
}

module.exports = Lorg;