var cv = require('opencv');

module.exports = function circle (mat, objects) {
      // Draw a circle over the object
      for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        mat.ellipse(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width / 2, obj.height / 2);
      }
      return mat;
};

