var cv = require('opencv');
var fs = require('fs');
//var converter = require('./transcode.js').duplex;
//TODO go back to duplex
var ffin = require('./transcode.js').in;
var ffout = require('./transcode.js').out;

//TODO go back to duplex
var transcoder = process.stdin.pipe(ffin);
var cvStream = new cv.ImageStream();
var count = 0;
cvStream.on('data', function(mat) {
    //console.log('openCV stream mat', typeof mat);
    count +=1;
    console.log('mat width', mat.width());
    if (count === 7) {
      console.log('seven images!');
    }
});
cvStream.on('end', function() {
  console.log('cvStream end');
});
cvStream.on('finish', function() {
  console.log('cvStream finish');
});
cvStream.on('close', function() {
  console.log('cvStream close');
});
cvStream.on('unpipe', function() {
  console.log('cvStream unpipe');
});
cvStream.on('error', function() {
  console.log('cvStream error');
});
cvStream.on('drain', function() {
  console.log('cvStream drain');
});
cvStream.on('pipe', function() {
  console.log('cvStream pipe');
});

transcoder.on('end', function() {
  console.log('transcoder end');
  //cvStream.end();
});
transcoder.on('finish', function() {
  console.log('transcoder finish');
});
transcoder.on('close', function() {
  console.log('transcoder close');
});

//TODO go back to duplex
ffout.pipe(cvStream, {end: false});
