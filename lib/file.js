var path = require('path');
var cv = require('opencv');

module.exports = function(file) {
  return new cv.VideoCapture(path.join(__dirname, '..', file));
};
