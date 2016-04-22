var test = require('tape');
var fs = require('fs');
var path = require('path');
var concat = require('concat-stream');
var pedStream = require('../ped-duplex-stream.js');

test('spits newline-delimited JSON', function (t) {
  t.plan(5);

	var readable = fs.createReadStream(path.join(__dirname, 'ped.avi'));
	var dup = new pedStream()
  t.equal(dup.readable, true, 'stream is readable');
  t.equal(dup.writable, true, 'stream is writable');
	readable.pipe(dup).pipe(concat(function (data) {
		t.equal(typeof data, 'string');
		t.ok(data.split('\n') instanceof Array, 'parses to an array');
		t.ok(JSON.parse(data.split('\n')[0]), 'array elmement is valid JSON');
	}));
});

test.skip('Works multiple times ?!', function (t) {
  t.plan(2);

	var readable = fs.createReadStream(path.join(__dirname, 'ped.avi'));
	var secondReadable = fs.createReadStream(path.join(__dirname, 'ped.avi'));
	var dup = pedStream
	readable.pipe(new dup()).on('end', function() {
		t.comment('readable 1 over....')
    t.equal(dup.writable, true, 'writable after first end event');
		secondReadable.pipe(new dup()).pipe(concat(function (data) {
      t.equal(dup.writable, true, 'writable after second end event');
		}));
	});
});
