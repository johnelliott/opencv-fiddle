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

  // create temp file
  var tempPath = path.join(__dirname, 'tmp', 'file.mov');
  var file = fs.createWriteStream(tempPath);
  // pipe the data into a file
  req.pipe(file);

  // declare victory
  req.on('data', function(data) {
    console.log('we got data!:', data);
  });

  req.on('end', function() {
    console.log('req end');
    res.writeHead(200, { 'Content-Type': 'application/json'});

    // call detector on that file
    detector(tempPath, function(err, data) {
      if (err) {
        // return instead of throwing an error here
        return console.error(err);
      }
      console.log('processed:', data);
      // send back the results
      res.write(JSON.stringify(data), ['Transfer-Encoding', 'chunked']);
    });

  });

  // clean up the temp file
  res.on('finish', function deleteTmpFile() {
    console.log('deleting', tempPath);
    fs.unlink(tempPath, function (err) {
      if (err) throw err;
      console.log('successfully deleted temp file');
    });
  });

});
