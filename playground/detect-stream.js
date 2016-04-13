var cv = require('opencv');
var fs = require('fs');
var tr = require('./transcode.js');

var transcoder = process.stdin.pipe(tr);
// TODO parse piped in file and explode if it's a .mov
var cvStream = new cv.ImageStream();
var algo = 'node_modules/opencv/data/haarcascade_fullbody.xml';

cvStream.on('data', function(im) {
  //console.log('im width', im.width());
  if (im.width() < 1 || im.height() < 1) throw new Error('image has no size');

  im.detectObject(algo, {}, function(err, matches) {
    if (err) {
      console.error("Error:", err);
      throw err;
    }

    if (matches.length > 0) {
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        im.ellipse(match.x + match.width / 2,
                   match.y + match.height / 2,
                   match.width / 2,
                   match.height / 2);
      }
      process.stdout.write(JSON.stringify(match));
      im.save("./tmp/ped" + Date.now() + ".jpg");
    }
  });
});

transcoder.pipe(cvStream, {end: false});
