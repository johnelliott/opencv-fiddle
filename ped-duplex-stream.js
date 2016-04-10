var through = require('through');
var duplex = require('duplexer');
var tr = require('./transcode');
var cv = require('opencv');

module.exports = function pedTransformStream() {
  // input/output streams for this module
  // TODO parse piped in file and explode if it's a .mov
  var algo = 'node_modules/opencv/data/haarcascade_fullbody.xml';
  var cvStream = new cv.ImageStream();
  var output = through();

  cvStream.on('finish', function() {
    output.end();
  });

  tr.pipe(cvStream);

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
        output.write(JSON.stringify(match));
        // do backup save for debugging
        //im.save("./tmp/ped" + Date.now() + ".jpg");
      }
    });
  });
  return duplex(tr, output);
};
