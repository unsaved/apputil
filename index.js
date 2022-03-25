"use strict";

module.exports.AppErr = require("./AppErr");
const appErrHandlers = require("./appErrHandlers");
for (let key in appErrHandlers) module.exports[key] = appErrHandlers[key];
module.exports.NetRC = require("./NetRC");
module.exports.JsShell = require("./JsShell");
module.exports.appVersion = JSON.parse(
  require("fs").readFileSync(require("path").join(__dirname, "package.json"))).
  version;
module.exports.isPlainObject = val =>
  typeof(val) === "object" && val !== null &&
    Object.getPrototypeOf(val) === Object.getPrototypeOf({});
