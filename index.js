var path = require('path');
var detector = require('./lib/detector.js');

var videoPath = path.join(__dirname, 'movies', 'ped-clip-2.mov');
console.log('video path', videoPath);

detector(videoPath, function(data) {
  console.log('data', data);
});
