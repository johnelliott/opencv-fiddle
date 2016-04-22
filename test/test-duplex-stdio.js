//var dpeDup = require('./duplex-module-test.js');
var dup = require('../ped-duplex-stream.js');

//TODO this should become a test that it returns readable/writable
var dup = process.stdin.pipe(dup()).pipe(process.stdout);
