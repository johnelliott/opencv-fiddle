var cv = require('opencv');

module.exports = function(file) {
  return new cv.VideoCapture(file);
};
