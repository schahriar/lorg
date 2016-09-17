const fs = require('fs');
const os = require('os');
const PassThrough = require('stream').PassThrough;
const EventEmitter = require('events').EventEmitter;

class Duplex extends EventEmitter {
  constructor(path) {
    super();
    this.path = path;
    this.fd = null;
    this.stream = new PassThrough();
  }

  _readBytes(len, position, callback) {
    let buffer = new Buffer(len);
    fs.read(this.fd, buffer, 0, len, position, (error) => { callback(error, buffer); });
  }

  getWritetableInterface() {
    return this.stream;
  }

  open() {
    if (this.fd) this.close();
    fs.open(this.path, 'a+', (error, fd) => {
      if (error) return this.emit('error', error);
      this.emit('open');
      this.fd = fd;
      this.write = fs.createWriteStream(null, { fd: fd });
      this.stream.uncork();
      this.stream.pipe(this.write);
      this.emit('bind');
    });
  }

  rename(path) {
    fs.renameSync(this.path, path);
  }

  close() {
    this.stream.cork();
    this.write.close();
    this.emit('close');
  }
}

module.exports = Duplex;