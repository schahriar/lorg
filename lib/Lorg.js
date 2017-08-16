const { Readable } = require('stream');
const os = require('os');

class Lorg extends Readable {
  constructor(options) {
    super();

    this._filter = null;
    this._queue = [];
    this._remainingSize = 0;
  }

  _read(size) {
    this._remainingSize = size;
    this._pushQueue();
  }

  _pushQueue() {
    let logString = '';

    while ((this._remainingSize > 0) && this._queue.length) {
      logString = this._logToString(this._queue.pop());
      this._remainingSize -= logString;
      this.push(logString);
    }
  }

  _logToString(log) {
    return `${JSON.stringify(log)}${os.EOL}`;
  }

  pushLog(type, item) {
    if (this._filter && (type !== this._filter)) return;
    // Extend item with Metadata
    item._META_ = {
      time: Date.now(),
      type: type
    };

    /** @todo: Cache duplicate objects */

    this._queue.push(item);
    this._pushQueue();
  }

  /*
  filter(type) {
    this._filter = type;
  }

  reset() {
    this._filter = null;
  }*/

  log(item) {
    this.pushLog("log", item);
  }

  warn(item) {
    this.pushLog("warn", item);
  }

  error(item) {
    this.pushLog("error", item);
  }

  trace(error) {
    this.pushLog("trace", { message: error.message, stack: error.stack });
  }
}

module.exports = Lorg;