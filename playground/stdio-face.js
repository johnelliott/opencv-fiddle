// How to use this one
// $ cat images/john.jpg | node stdio-face.js >> tmp/stdio-circled-face.jpg

var cv = require('opencv');
var fs = require('fs');

var ws = new cv.ImageDataStream();
process.stdin.pipe(ws);

ws.on('load', function(im) {
  if (im.width() < 1 || im.height() < 1) throw new Error('image has no size');

  var algo = 'node_modules/opencv/data/haarcascade_frontalface_alt.xml';
  im.detectObject(algo, {}, function(err, faces) {
    if (err) {
      console.error("Error:", err);
      throw err;
    }

    for (var i = 0; i < faces.length; i++) {
      var face = faces[i];
      im.ellipse(face.x + face.width / 2,
                 face.y + face.height / 2,
                 face.width / 2,
                 face.height / 2);
    }

    var buf = im.toBuffer();
    process.stdout.write(buf);

    console.log('done');
  });
});
