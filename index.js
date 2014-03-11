var child_process = require("child_process");

module.exports = {
  config: require('./lib/config'),
  setup: require('./lib/setup'),
  pull: require('./lib/pull'),
  push: require('./lib/push'),
  run: require('./lib/run')
};
