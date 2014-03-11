var remotely = require("remotely");
var config = require("./config").read();

module.exports = call;

function call (command) {
  var params = Array.prototype.slice.call(arguments);
  params.splice(0, 0, config.host);
  return remotely.apply(undefined, params);
}
