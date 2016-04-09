var duplex = require('duplexer');

module.exports = function(rs, ws) {
    rs.pipe(ws);
    return duplex(rs, ws);
};

