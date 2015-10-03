var cv = require('opencv');
var loader = require('./lib/file.js');

var vid = loader('videos/face.mov');

var namedWindow = new cv.NamedWindow('Video', 1);

var intervalId = setInterval(function() {
  vid.read(function(err, mat) {
    if (err) {
      console.error("Error:", err);
      throw err;
    }

    mat.detectObject('node_modules/opencv/data/haarcascade_frontalface_alt.xml', {}, function(err, faces) {
      if (err) {
        console.error("Error:", err);
        throw err;
      }

      // Draw a circle over the face
      for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        mat.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
      }

      namedWindow.show(mat);

      var res = namedWindow.blockingWaitKey(0, 50);
      if (res >= 0) {
        clearInterval(intervalId);
      }

    });
  });
}, 150);

