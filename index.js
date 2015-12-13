var fs = require('fs');
var path = require('path');
var detector = require('./lib/detector.js');
var http = require('http');

// Create server
var server = http.createServer();

server.listen(3000, function() {
  console.log('listening on port 3000');
});

server.on('request', function(req, res) {
  // TODO check content-type for posts

  var tempPath = path.join(__dirname, 'tmp', 'file.mov');
  var file = fs.createWriteStream(tempPath);
  file.on('open', function() {
    console.log('the file is open');
    req.pipe(file);
  });

  file.on('finish', function() {
    console.log('file finished,', file.bytesWritten, "bytes written");

    detector(tempPath, function(err, data) {
      if (err) {
        // return instead of throwing an error here
        return console.error(err);
      }
      // ignore empty data
      if (data.length) {
        console.log('found', data);
        // send back the results
        res.write(JSON.stringify(data), ['Transfer-Encoding', 'chunked']);
      }
    });

  });

  file.on('pipe', function(src) {
    console.log('piped');
  });

  req.on('end', function() {
    console.log('req end');
    res.writeHead(200, { 'Content-Type': 'application/json'});
  });

  res.on('finish', function deleteTmpFile() {
    console.log('deleting', tempPath);
    fs.unlink(tempPath, function (err) {
      if (err) throw err;
      console.log('successfully deleted temp file');
    });
  });

});
