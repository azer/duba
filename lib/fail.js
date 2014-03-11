var style = require("styled");

module.exports = fail;

function fail (error) {
  console.error(style.red('\n    Error: %s\n'), error.message);
  process.exit(1);
}
