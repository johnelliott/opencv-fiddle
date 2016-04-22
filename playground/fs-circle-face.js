// node index.js && open -a preview images/john-grey.jpg && rm -f images/john-grey.jpg

var cv = require('opencv');

cv.readImage("./images/john.jpg", function(err, im) {
  if (err) {
    console.error("Error:", err);
    throw err;
  }
  if (im.width() < 1 || im.height() < 1) throw new Error('image has no size');

  im.detectObject('node_modules/opencv/data/haarcascade_frontalface_alt.xml', {}, function(err, faces) {
    if (err) {
      console.error("Error:", err);
      throw err;
    }

    for (var i = 0; i < faces.length; i++) {
      var face = faces[i];
      im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);
    }

    im.save("./tmp/face.jpg");

    console.log('done');
  });
});
