var debug = require("local-debug")('run');
var config = require("./config").read();
var fail = require("./fail");
var remote = require("./remote");
var path = require("path");

module.exports = cli;

function cli (command) {
  var project = command._[0];
  if (!project) fail(new Error('A project name is required'));

  var dir = path.join(config.remoteDir, project);

  var remoteCommand = command._.slice(1).join(' ');

  debug('Running %s on %s:%s', remoteCommand, config.host, dir);
  remoteCommand = 'cd ' + dir + ' && ' + remoteCommand;

  if (command.profile) {
    remoteCommand = 'source ~/.profile; ' + remoteCommand;
  }

  return remote(remoteCommand, { stdio: 'inherit' });
}
