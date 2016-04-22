var through = require('through');
var duplex = require('duplexer');
var Tr = require('./transcode');
var ImageTransformStream = require('./image-transform-stream.js');
var cv = require('opencv');
var rc = require('rgb-random-array');

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
  var state = {
    frames: [],
    recs: [],
    matches: []
  };
  cvStream.on('data', function(im) {
    if (im.width() < 1 || im.height() < 1) throw new Error('image has no size');
    state.frames.push(im);
    im.detectObject(algo, {}, function(err, matches) {
      if (err) {
        console.error("Error:", err);
        throw err;
      }

      if (matches.length > 0) {
        var color = rc()
        for (var i = 0; i < matches.length; i++) {
          state.matches.push(matches[i]);
          var match = matches[i];

          var matchBoundingBox = [
            match.x,
            match.y,
            match.x + match.width /2,
            match.y + match.height /2
          ];
          console.log('matchBoundingBox', matchBoundingBox)

          var track = new cv.TrackedObject(im, matchBoundingBox, {channel: 'value'});
          var rec = track.track(im);
          state.recs.push(rec);
          im.rectangle([rec[0], rec[1]], [rec[2], rec[3]], color)

          im.ellipse(match.x + match.width / 2,
                     match.y + match.height / 2,
                     match.width / 2,
                     match.height / 2, color);
          //im.rectangle([match.x, match.y], [match.width, match.height], color);
          // Write to output stream because cvStream is an event emitter
          output.write(JSON.stringify(match) + '\n');
          // do backup save for debugging
          im.save("./tmp/ped" + Date.now() + ".jpg");
        }
      }
    });
    console.log('state:', state)
  });
  return duplex(tr, output);
};
