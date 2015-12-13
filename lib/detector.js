var cv = require('opencv');

// I could use a module pattern to add start and stop methods to allow cleanup of the interval
module.exports = detector;

// What I should do is pipe to the detector, and the detector will handle saving
// to the fs and whatever else it needs to coddle the node-opencv api
// so basically req.pipe(detector)
// detector.pipe(res)
// then the detector basically becomes a streaming object detector thing,
// and it doesn't have to know about http or where it's being used. It gets an 
// input video and spits out json summary data


// Async flow
  // get path
  // read video off file system
  // create a new videoCapture object
  // set up a debouncer/limiter
  // read a frame
  // call callback along for the ride with result data

function detector(path, callback) {
  console.log('video path', typeof(path), path);
  var vid = new cv.VideoCapture(path);

  startProcessing(vid, callback);
}

// TODO this obviously sucks and has no control... fix it
function startProcessing (vid, callback) {
  setInterval(function intervalCallback() {
    vid.read(function vidReadCallback(err, mat) {
      if (err) {
        console.error("Error:", err);
        throw err;
      }
      detect(mat, callback);
    });
  }, 150);
}

function detect(mat, callback) {
  mat.detectObject('node_modules/opencv/data/haarcascade_fullbody.xml', {}, function handleMatches(err, matches) {
    if (err) {
      //throw err;
      console.warn("error in some mat thing", err);
      return callback(null, []);
    }
    callback(null, matches);
  });
}

function sample(interval, callback) {
  // TODO use 150ms and a frame sampling function
}
