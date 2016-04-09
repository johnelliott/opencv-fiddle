//var Dup = require('./duplex-module-test.js');
var Dup = require('./ped-duplex-stream.js');

var dup = new Dup(process.stdin, process.stdout);
