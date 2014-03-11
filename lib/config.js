var debug = require("local-debug")('config');
var path = require("path");
var fs = require("fs");
var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var filename = path.join(home, '.duba');

module.exports = {
  filename: filename,
  exists: exists,
  read: read,
  save: save
};

function exists () {
  return fs.existsSync(filename);
}

function read () {
  try {
    return JSON.parse(fs.readFileSync(filename));
  } catch(error) {}
}

function save (doc) {
  var str = JSON.stringify(doc, null, '  ');

  debug('Saving %s', filename);

  fs.writeFileSync(filename, str);
}
