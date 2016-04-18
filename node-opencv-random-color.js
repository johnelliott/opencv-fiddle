var rc = require('randomcolor');

module.exports = function () {
  return rc({format: "rgb"})
    .match(/\((.*)\)/)[1]
    .split(', ')
    .map(function(s) {
      return Number.parseInt(s)
    })
}
