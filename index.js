"use strict";

module.exports.AppErr = require("./AppErr");
const appErrHandlers = require("./appErrHandlers");
for (const key in appErrHandlers) module.exports[key] = appErrHandlers[key];
module.exports.NetRC = require("./NetRC");
module.exports.JsShell = require("./JsShell");
module.exports.getAppVersion = dirName => {
    if (typeof dirName !== "string") throw new Error(
      "getAppVersion must be called like: getAppVersion(__dirname)");
    return JSON.parse(
      require("fs").readFileSync(require("path").
      join(dirName, "package.json"))).version;
};
module.exports.isPlainObject = val =>
  typeof(val) === "object" && val !== null &&
    Object.getPrototypeOf(val) === Object.getPrototypeOf({});
