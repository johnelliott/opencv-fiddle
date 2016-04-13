var test = require('tape');
var fs = require('fs');
var path = require('path');
var concat = require('concat-stream');
var pedStream = require('../ped-duplex-stream.js');


test('stream anatomy', function (t) {
  t.plan(2);

  var dup = pedStream()
	//TODO this should become a test that it returns readable/writable
	t.equal(typeof dup, 'object');
	t.equal(dup.writable, true);
});

test('spits newline-delimited JSON', function (t) {
  t.plan(3);

	var readable = fs.createReadStream(path.join(__dirname, 'ped.avi'));
	var dup = pedStream()
	readable.pipe(dup).pipe(concat(function (data) {
		t.equal(typeof data, 'string');
		t.ok(data.split('\n') instanceof Array);
		t.ok(JSON.parse(data.split('\n')[0]));
	}));
});
