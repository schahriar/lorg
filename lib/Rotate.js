const fs = require('fs');
const os = require('os');
const Duplex = require('./Duplex');

class Rotate extends Duplex {
  constructor(path, options) {
    super(path);
    this.options = (options)?options:{};
  }

  rotate() {
    // Stat the file
    fs.stat(this.path, (error, stats) => {
      if (error) return this.emit('error', error);
      // Timeout -> Defaults to a day
      let timeout = ((stats.birthtime.getTime() || Date.now()) + (this.options.interval || 86400000)) - Date.now();

      setTimeout(() => {
        this.rename(this.path + '.old');
        this.open();
        this.once('bind', () => this.rotate());
      }, Math.min(1000, Math.max(timeout, 0)));
    });
  }
}

module.exports = Rotate;