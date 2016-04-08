var cv = require('opencv');
var fs = require('fs');
var converter = require('./transcode.js');

var transcoder = process.stdin.pipe(converter);
// TODO parse piped in file and explode if it's a .mov
var cvStream = new cv.ImageStream();
cvStream.on('data', function(mat) {
    //console.log('openCV stream mat', typeof mat);
    console.log('mat width', mat.width());
});

transcoder.pipe(cvStream, {end: false});
