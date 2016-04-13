var through = require('through');
var duplex = require('duplexer');
var tr = require('./transcode');
var cv = require('opencv');

module.exports = function pedTransformStream() {

  // TODO consider: if (!(this instanceof ConcatStream)) return new ConcatStream(opts, cb)

    // TODO parse piped in file and explode if it's a .mov
  var cvStream = new cv.ImageStream();
  // input/output streams for this module
  var output = through();

  tr.pipe(cvStream);

  cvStream.on('finish', function() {
    output.end();
  });

  var algo = 'node_modules/opencv/data/haarcascade_fullbody.xml';
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
        output.write(JSON.stringify(match) + '\n');
        // do backup save for debugging
        //im.save("./tmp/ped" + Date.now() + ".jpg");
      }
    });
  });
  return duplex(tr, output);
};
