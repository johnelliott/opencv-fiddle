var test = require('tape');
var path = require('path');
var file = require('../../lib/file.js');

test('Local filesystem video loader', function(t) {
  t.plan(2);

  t.equal(typeof(file), 'function');
  t.ok(file(path.join(__dirname, '../../movies/face.mov')), 'yep, i\s ok');
});
