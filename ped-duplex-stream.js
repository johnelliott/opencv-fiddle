var through = require('through');
var duplex = require('duplexer');
var Tr = require('./transcode');
var ImageTransformStream = require('./image-transform-stream.js');
var cv = require('opencv');

module.exports = function PedTransformStream() {

  // input/output streams for this module
  var cvStream = new ImageTransformStream();
  var tr = new Tr();
  var output = through();

  // TODO parse piped in file and explode if it's a .mov
  tr.pipe(cvStream);

  cvStream.on('finish', function() {
    output.end();
  });

  var algo = 'node_modules/opencv/data/haarcascade_fullbody.xml';
  var hadSeedPed = false;
  cvStream.on('data', function(im) {
    if (im.width() < 1 || im.height() < 1) throw new Error('image has no size');
    im.detectObject(algo, {}, function(err, matches) {
      if (err) {
        console.error("Error:", err);
        throw err;
      } else if (hadSeedPed) {
        console.log('we don\'t need any more!')
        return;
      }

      if (matches.length > 0) {
        hadSeedPed = true;
        console.error('I could call this with', matches);
        for (var i = 0; i < matches.length; i++) {
          var match = matches[i];

          var matchBoundingBox = [
            match.x,
            match.y,
            match.x + match.width,
            match.y + match.height
          ];

          /*
          im.ellipse(match.x + match.width / 2,
                     match.y + match.height / 2,
                     match.width / 2,
                     match.height / 2);
                     */
          im.rectangle([match.x, match.y], [match.width, match.height]);

          var track = new cv.TrackedObject(im, matchBoundingBox, {channel: 'value'});
          console.log(track);
          // Write to output stream because cvStream is an event emitter
          output.write(JSON.stringify(match) + '\n');
          // do backup save for debugging
          im.save("./tmp/ped" + Date.now() + ".jpg");
        }
      }
    });
  });
  return duplex(tr, output);
};

/*
 * notes
 * could use the detection to pick up if the tracker loses the scent
 */
