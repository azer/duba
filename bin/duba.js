#!/usr/bin/env node

require('default-debug')('duba:setup', 'duba:pull', 'duba:push', 'duba:config', 'duba:run');

var newCommand = require("new-command");
var command = newCommand('pull', 'push', 'run', 'setup', {
  p: 'profile'
});

var duba = require("../");
var subcommand;

if (command.pull) subcommand = duba.pull;
if (command.push) subcommand = duba.push;
if (command.run) subcommand = duba.run;
if (command.setup) subcommand = duba.setup;
if (!subcommand) subcommand = newCommand.help;

run();

function run () {
  if(duba.config.exists()) {
    fixProjectName();
    subcommand(command);
    return;
  }

  duba.setup(command, function () {
    fixProjectName();
    subcommand(command);
  });
}

function fixProjectName () {
  if (command._.length && !command.run) return;

  var cwd = process.cwd();
  var localDir = duba.config.read().localDir;
  var inLocalWS = cwd.slice(0, localDir.length) == localDir;

  if (!inLocalWS) return;

  var rpl = cwd.slice(localDir.length + 1).split('/')[0];

  if (!rpl) return;

  command._.splice(0, 0, rpl);
}
