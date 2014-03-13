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
    host: config.host,
    localArchive: path.join('/tmp/', project) + '.tar.gz',
    remoteArchive: path.join('/tmp/', project) + '.tar.gz'
  };

  debug(format('Pushing to {host}:{dest} from {source}...', options));

  exec(format("cd {source} && tar --exclude='.git' --exclude='node_modules' -cvf {localArchive} .", options), function (error, stdout, stderr) {
    if (error) return callback(error);
    //if (stderr) return callback(new Error(stderr));

    debug('Copying tarball to %s:%s', options.host, options.remoteArchive);

    exec(format("scp {localArchive} {host}:{remoteArchive}", options), function (error, stdout, stderr) {
      if (error) return callback(error);
      if (stderr) return callback(new Error(stderr));

      debug('Extracting %s into %s', options.remoteArchive, options.dest);

      remote(format("tar -xvvf {remoteArchive} -C {dest}", options), function (error, stdout, stderr) {
        if (error) return callback(error);
        if (stderr) return callback(new Error(stderr));

        debug('Done!');

        remote(format("rm {remoteArchive}", options));
      });
    });
  });

}
