var test = require('tape');
var file = require('../../lib/file.js');

test('file loader test', function(t) {
  t.plan(2);

  t.equal(typeof(file), 'function');
  t.ok(file('/Users/john/Dropbox/dev/practice/cv/movies/john.mov'), 'yep, i\s ok');
});
