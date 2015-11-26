var cv = require('opencv');

// I could use a module pattern to add start and stop methods to allow cleanup of the interval
module.exports = function detector(path, callback) {
  console.log('video path', path);
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
