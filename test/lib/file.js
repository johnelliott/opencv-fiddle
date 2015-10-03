var test = require('tape');
var path = require('path');
var file = require('../../lib/file.js');

test('file loader test', function(t) {
  t.plan(2);

  t.equal(typeof(file), 'function');
  t.ok(file(path.join(__dirname, '../../videos/face.mov')), 'yep, i\s ok');
});
