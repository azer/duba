var format = require("format-text");
var debug = require("local-debug")('push');
var exec = require("child_process").exec;
var path = require("path");
var config = require("./config").read();
var fail = require("./fail");
var remote = require("./remote");

module.exports = cli;

function cli (command) {
  var project = command._[0];
  if (!project) fail(new Error('A project name is required'));

  push(project, function (error) {
    if (error) fail(error);

    debug('Done.');
  });
}

function push (project, callback) {
  var options = {
    source: path.join(config.localDir, project),
    dest: path.join(config.remoteDir, project),
    host: config.host
  };

  debug(format('Pushing to {host}:{dest} from {source}...', options));

  remote('mkdir -p ' + options.dest, function (error) {
    if (error) return callback(error);

    exec(format("scp -r {source}/* {host}:{dest}/.", options), function (error, stdout, stderr) {
      if (error) return callback(error);
      if (stderr) return callback(new Error(stderr));
      callback();
    });
  });
}
