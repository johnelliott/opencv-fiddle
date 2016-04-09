var fs = require('fs');
var stream = require('stream');
var duplex = require('duplexer');
var cv = require('opencv');
var tr = require('./transcode');

module.exports = function createPedDuplex(rs, ws) {
  // input/output streams for this module
  // TODO parse piped in file and explode if it's a .mov
  var algo = 'node_modules/opencv/data/haarcascade_fullbody.xml';
  var cvStream = new cv.ImageStream();
  rs.pipe(tr).pipe(cvStream, {end: false});

  cvStream.on('data', function(im) {
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
        // Write to output stream because cvStream is an event emitter
        ws.write(JSON.stringify(match));
        // do backup save for debugging
        im.save("./tmp/ped" + Date.now() + ".jpg");
      }
    });
  });

  return duplex(rs, ws);
};

