var http = require('http');
var fs = require('fs');
var dup = require('./ped-duplex-stream.js');

var staticServer = require('ecstatic')({ root: __dirname + '/public' });

// Set up application data server
var server = http.createServer(function(req, res) {
  if (req.url == '/api') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('This is API data');
  } else if (req.method === 'POST') {
    req.pipe(dup()).pipe(res);
  } else {
    req.addListener('end', function () {
      //TODO specify caching, if needed and use in dev mode
      staticServer(req, res);
    }).resume();
  }
});

var port = 3000;
console.log('Listen:', port);
server.listen(port);
