var debug = require("local-debug")('pull');
var format = require("format-text");
var path = require("path");
var exec = require("child_process").exec;
var config = require("./config").read();
var fail = require("./fail");
var remote = require("./remote");

module.exports = cli;

function cli (command) {
  var project = command._[0];
  if (!project) fail(new Error('A project name is required'));

  pull(project, function (error) {
    if (error) fail(error);

    debug('Done.');
  });
}

function pull (project, callback) {
  var options = {
    name: project,
    remoteDir: config.remoteDir,
    dest: config.localDir,
    host: config.host,
    remoteArchive: path.join('/tmp', project) + '.tar.gz',
    localArchive: path.join('/tmp', project) + '.tar.gz'
  };

  debug('Pulling %s from %s into %s', project, config.host, options.dest);

  remote(format("cd {remoteDir} && tar --exclude='.git' --exclude='node_modules' -cvf {remoteArchive} {name}", options), function (error, stdout, stderr) {
    if (error) return callback(error);
    if (stderr) return callback(new Error(stderr));

    exec(format('scp {host}:{remoteArchive} {localArchive}', options), function (error, stdout, stderr) {
      if (error) return callback(error);
      if (stderr) return callback(new Error(stderr));

      remote(format('rm {remoteArchive}', options));

      exec(format('tar -xvvf {localArchive} -C {dest}', options), function (error, stdout, stderr) {
        if (error) return callback(error);
        callback();
      });
    });
  });
}
