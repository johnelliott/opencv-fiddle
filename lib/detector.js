var cv = require('opencv');
var stream = require('stream');

// I could use a module pattern to add start and stop methods to allow cleanup of the interval
module.exports = detector;

// What I should do is pipe to the detector, and the detector will handle saving
// to the fs and whatever else it needs to coddle the node-opencv api
// so basically req.pipe(detector)
// detector.pipe(res)
// then the detector basically becomes a streaming object detector thing,
// and it doesn't have to know about http or where it's being used. It gets an 
// input video and spits out json summary data

function detector(path, callback) {
  console.log('video path', typeof(path), path);
  var vid = new cv.VideoCapture(path);

  var intervalId = setInterval(function intervalCallback() {
    vid.read(function vidReadCallback(err, mat) {
      if (err) {
        console.error("Error:", err);
        throw err;
      }

      mat.detectObject('node_modules/opencv/data/haarcascade_fullbody.xml', {}, function(err, matches) {
        if (err) {
          throw err;
        }
        callback(null, matches);
      });

    });
  }, 150);
};
