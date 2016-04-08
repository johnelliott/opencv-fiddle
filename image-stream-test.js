var fs = require('fs');
var cv = require('opencv');
var concat = require('concat-stream');

// This is the imageStream we want to deal with. It requires complete image chunks to work, so we need to baby it and ensure we're getting complete chunks. The easiest way is to read indovidual files off the fs and concat them together before writing them to the opencv image stream.
// Another approach would be to build parsing into the transcoder to seperate the images from the bytestream coming out of the ffmpeg image2pipe muxer...

var cvStream = new cv.ImageStream();

// read a directory with temporary images
fs.readdir('./tmp/', function(err, files) {
    if (err) {
        console.error(err);
        throw err;
    }
    files.map(function pipeImages (im) {
        if (im.indexOf('jpeg') !== -1) {
            console.log('found a jpeg', im);
            var rs = fs.createReadStream('./tmp/' + im);
            var concatStream = concat(function gotPicture (data) {
                cvStream.write(data);
            });
            rs.pipe(concatStream);
        }
        return;
    });
});

cvStream.on('data', function(mat) {
    console.log('openCV stream mat', typeof mat);
    console.log('Image stream mat', mat);
});

