var cp = require('child_process');
var duplex = require('duplexer');

var ffmpeg = cp.spawn("ffmpeg", [
    "-re", // -re i Read input at native frame rate. Mainly used to simulate a grab device or live input stream
    "-y", // Overwrite output files without asking.
    "-i", "pipe:0", // use an input file for testing out
    "-f",
    "mjpeg",
    "pipe:1"
]);
ffmpeg.stdin.setEncoding('utf8');

// set encoding, not sure if I need to do this...

//process.stdin.pipe(ffmpeg.stdin);
//ffmpeg.stdout.pipe(process.stdout);

module.exports = duplex(ffmpeg.stdin, ffmpeg.stdout);
