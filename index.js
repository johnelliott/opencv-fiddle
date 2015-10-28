var cv = require('opencv');
var path = require('path');
var loader = require('./lib/file.js');
var encircle = require('./lib/circle.js');

var vid = loader(path.join(__dirname, 'movies', 'ped-clip-2.mov'));

var namedWindow = new cv.NamedWindow('Video', 1);

var intervalId = setInterval(function() {
  vid.read(function(err, mat) {
    if (err) {
      console.error("Error:", err);
      throw err;
    }

    mat.detectObject('node_modules/opencv/data/haarcascade_fullbody.xml', {}, function(err, faces) {
      if (err) {
        console.error("Error:", err);
        throw err;
      }

      // Draw a circle over the face
      var circledMat = encircle(mat, faces);

      // Draw the frame to the window
      namedWindow.show(circledMat);

      var res = namedWindow.blockingWaitKey(0, 50);
      if (res >= 0) {
        clearInterval(intervalId);
      }

    });
  });
}, 150);

