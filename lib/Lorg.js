const PassThrough = require('stream').PassThrough;
const Duplex = require('./Duplex');
const Rotate = require('./Rotate');
const os = require('os');

class Lorg extends PassThrough {
  constructor(options) {
    super(options);
  }

  _out_(type, args) {
    // Create a new string buffer
    let buff = "";
    // Fill string with passed arguments using Lorg#_toString
    for (let i = 0; i < args.length; i++) buff += this._toString(args[i]);

    // Write buffer to stream with prefix template
    this.write(`<${type}>:<${Date.now()}>\t${buff}${os.EOL}`);
  }

  log() {
    this._out_("log", arguments);
  }

  warn() {
    this._out_("warn", arguments);
  }

  error() {
    this._out_("error", arguments);
  }

  trace(error) {
    this._out_("trace", [error.stack]);
  }

  open(path) {
    let duplex = new Duplex(path);
    duplex.open();
    duplex.on('bind', () => {
      this.pipe(duplex.getWritetableInterface());
    });
    return duplex;
  }
  
  rotate(path) {
    let rotator = new Rotate(path);
    rotator.open();
    rotator.on('bind', () => {
      this.pipe(rotator.getWritetableInterface());
    });
    rotator.once('bind', () => rotator.rotate());
    return rotator;
  }

  _toString(val) {
    if (val instanceof Error) return "- ERROR <" + val.message + "> -";
    else if (typeof val === 'object') return JSON.stringify(val);
    else return val.toString();
  }
}

module.exports = Lorg;