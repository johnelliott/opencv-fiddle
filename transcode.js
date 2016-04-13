var cp = require('child_process');
var duplex = require('duplexer');

// TODO parse piped in file and explode if it's a .mov
module.exports = function Transcoder() {
  var ffmpeg = cp.spawn("ffmpeg", [
    "-re", // -re i Read input at native frame rate. Mainly used to simulate a grab device or live input stream
    "-y", // Overwrite output files without asking.
    "-i",
    "pipe:0", // 0 is standard in, and .MOV files don't really work
    "-an", // don't expect audio
    "-s", "120x90", // resize
    //"-blocksize", "100K", // could be useful if doing larger images
    //"-r", "1", // only sample 1 fps??
    //"-vframes", "7", // limit number of output frames (used for debugging with 7 frames)
    "-preset", "ultrafast",
    "-f",
    "image2pipe",
    //"-c:v", "jpg",
    "pipe:1"
  ]);
  // testing: ffmpeg -i movies/ped-clip-2.mov -s 120x90 -r 1 -vframes 7 -f image2 './tmp/img-%03d.jpeg'
  // set encoding, not sure if I need to do this...
  ffmpeg.stdin.setEncoding('utf8');

  return duplex(ffmpeg.stdin, ffmpeg.stdout);
};
