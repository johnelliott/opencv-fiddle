var trans = require('./transcode.js')
var rs = require('fs').createReadStream('./movies/ped-clip-2b.avi')
rs.pipe(trans).pipe(process.stdout)
