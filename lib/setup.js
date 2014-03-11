var prompt = require("prompt-input")();
var fs = require("fs");
var checkfor = require("checkfor");
var debug = require("local-debug")('setup');
var expand = require("expand-home-dir");
var remotely = require("remotely");
var config = require("./config");
var fail = require("./fail");

var validate = checkfor({
  host: { is: String, required: true, len: [1] },
  remoteDir: { is: String, required: true, len: [2] },
  localDir: { is: LocalWorkspace, required: true, len: [2] }
});

module.exports = cli;

function LocalWorkspace (path) {
  if (!fs.existsSync(path)) {
    fail(new Error('Local workspace "' + path + '" does not exist.'));
  }

  return path;
}

function cli (command, callback) {
  debug('Looks like it\'s your first time to run duba. Let me save your remote and local workspace info into ~/.duba');

  var questions = {
    host: '{bold}{cyan}Remote SSH hostname (e.g user@hostname):{reset}',
    remoteDir: '{bold}{cyan}Remote workspace directory (e.g ~/dev):{reset}',
    localDir: '{bold}{cyan}Local workspace directory (e.g ~/dev):{reset}'
  };

  prompt(questions, function (answers) {
    var error;
    answers.localDir = expand(answers.localDir);

    if (error = validate(answers)) fail(error);

    verifyRemoteWorkspace(answers, function () {
      var doc = answers;
      config.save(doc);

      debug('Done.');
      debug('Please make sure you have the proper SSH configuration that allows your user can SSH to the remote without password prompt.');

      callback && callback();
    });
  });
}

function verifyRemoteWorkspace (options, callback) {
  debug('Verifying %s...', options.host);

  remotely(options.host, "echo $HOME", function (error, stdout) {
    if (error) fail(error);
    if (!stdout) fail(new Error('Failed to run a command on ' + options.host + ' remotely'));
    callback();
  });
}
