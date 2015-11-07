var cv = require('opencv');

module.exports = function annotate(path, callback) {

console.log('video path', path);
  // Load in the streaming data
  var vid = new cv.VideoCapture(path);

  var intervalId = setInterval(function intervalCallback() {
    vid.read(function vidReadCallback(err, mat) {
      if (err) {
        console.error("Error:", err);
        throw err;
      }

      mat.detectObject('node_modules/opencv/data/haarcascade_fullbody.xml', {}, function(err, matches) {
        if (err) {
          console.error("Error:", err);
          throw err;
        }

        // call callback with the data we have
        callback(matches);

      });
    });
  }, 150);
};
