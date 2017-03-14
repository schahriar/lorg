const Lorg = require('../lib/Lorg');

global.expect = require('chai').expect;
global.lorg = new Lorg();

require('./interface.unit.js');