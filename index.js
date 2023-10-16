"use strict";
const { validate } = require("@admc.com/bycontract-plus");

module.exports.AppErr = require("./AppErr");
const appErrHandlers = require("./appErrHandlers");
for (const key in appErrHandlers) module.exports[key] = appErrHandlers[key];
module.exports.NetRC = require("./NetRC");
module.exports.JsShell = require("./JsShell");
module.exports.getAppVersion = dirName => {
    if (typeof dirName !== "string")
        throw new Error("getAppVersion must be called like: getAppVersion(__dirname)");
    return JSON.parse(
      require("fs").readFileSync(require("path").join(dirName, "package.json"))).version;
};
module.exports.isPlainObject = val =>
  typeof val === "object" && val !== null &&
    Object.getPrototypeOf(val) === Object.getPrototypeOf({});

module.exports.YMD_RE = /^(\d{4})-([01]\d)-([0-3]\d)$/;

/*
 * Generate a Date for a date for local midnight.
 *
 * OOTB when you instantiate a Date without specifying a time you get a midnig UTC time.
 * (In some contexts you may get a date/time midnight of the NEXT day!)
 *
 * @param yyyy-mm-dd date string.
 */
module.exports.mkDate = s => {
    validate([s], ["strictdatestr"]);
    const ymdEx = module.exports.YMD_RE.exec(s);
    if (!ymdEx) return new Date(s);
    const newDate = new Date(0);
    newDate.setFullYear(parseInt(ymdEx[1]), parseInt(ymdEx[2] - 1), parseInt(ymdEx[3]));
    newDate.setHours(0);  // work-around for issue mentioned in function JSDoc above
    return newDate;
};

module.exports.plusify = (n, decimals) => {
    validate([n, decimals], ["number", "int"]);
    const truncated = Number(n.toFixed(decimals));
    const str = truncated < 0 ? String(truncated) : `+${truncated}`;
    const ex = /[.](\d*)/.exec(str);
    if (!ex) return str + "." + "0".repeat(decimals);  // eslint-disable-line prefer-template
    if (ex[1].length === decimals) return str;
    return str + "0".repeat(decimals - ex[1].length);  // eslint-disable-line prefer-template
};
