var util = require('util')
var stream = require('stream')
var cv = require('opencv');
var Tr = require('./transcode');

function ImageTransformStream() {
  stream.Transform.call(this, {objectMode: true})
}

util.inherits(ImageTransformStream, stream.Transform)

ImageTransformStream.prototype._transform = function(buf, encoding, callback) {
  var self = this //sry...
  cv.readImage(buf, function(err, matrix){
    if (err) {
      return callback(err)
      //return self.emit('error', err)
    }
    console.log('what typeof mat we got', typeof matrix)
    console.log('what mat we got', matrix)
    console.log(typeof matrix.inspect())
    console.log(matrix.inspect())
    self.push(matrix)
    callback()
  })
}

ImageTransformStream.prototype._flush = function(callback) {
  callback()
}

module.exports = ImageTransformStream
