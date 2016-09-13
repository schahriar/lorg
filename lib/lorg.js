const PassThrough = require('stream').PassThrough;
const os = require('os');

class Lorg extends PassThrough {
  constructor(options) {
    super(options);
  }

  add(type, str) {
    this.write(`<#${type}>:<@${Date.now()}> ${str}${os.EOL}`);
  }

  log() {
    let buff = "";
    for (let i = 0; i < arguments.length; i++) buff += this.toString(arguments[i]);
    this.add("log", buff);
  }

  warn() {
    let buff = "";
    for (let i = 0; i < arguments.length; i++) buff += this.toString(arguments[i]);
    this.add("warn", buff);
  }

  error() {
    let buff = "";
    for (let i = 0; i < arguments.length; i++) buff += this.toString(arguments[i]);
    this.add("error", buff);
  }

  toString(val) {
    if (val instanceof Error) return "- ERROR <" + val.message + "> -";
    else if (typeof val === 'object') return JSON.stringify(val);
    else return val.toString();
  }
}

module.exports = Lorg;