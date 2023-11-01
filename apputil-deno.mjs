import AppErrRef from "./deno/AppErr.js";
import { conciseCatcher as conciseCatcherRef, mkConciseErrorHandler as mkConciseErrorHandlerRef }
    from "./deno/appErrHandlers.js";
import NetRCRef from "./deno/NetRC.js";
import JsShellRef from "./deno/JsShell.js";
export const AppErr = AppErrRef;
export const conciseCatcher = conciseCatcherRef;
export const mkConciseErrorHandler = mkConciseErrorHandlerRef;
export const NetRC = NetRCRef;
export const JsShell = JsShellRef;
import { z } from "https://deno.land/x/zod/mod.ts";
import zxsRef from "./deno/zod-extra-schemas.js";
export const zxs = zxsRef;

/*  No longer necessary because yargs version() function now does this natively:
import fs from "fs";
import path from "path";
export const getAppVersion = dirName => {
    if (typeof dirName !== "string")
        throw new Error("getAppVersion must be called like: getAppVersion(__dirname)");
    return JSON.parse(fs.readFileSync(path.join(dirName, "package.json"))).version;
};
*/
export const isPlainObject = val =>
  typeof val === "object" && val !== null &&
    Object.getPrototypeOf(val) === Object.getPrototypeOf({});

export const YMD_RE = /^(\d{4})-([01]\d)-([0-3]\d)$/;

/*
 * Generate a Date from a string, and IF the string is a proper date in strict format
 * (see @param below) then set time to local midnight of that day.
 *
 * OOTB when you instantiate a Date without specifying a time you get a midnig UTC time.
 * (In some contexts you may get a date/time midnight of the NEXT day!)
 *
 * @param str string, either yyyy-mm-dd (with special local-midnight-handling) or
 *        any other string accepted by the native Date constructor.
 * @param h hour offset, optional integer
 * @param m minute offset, optional integer
 * @param s second offset, optional integer
 * @param ms millisecond offset, optional integer
 */
export const mkDate = (str, h=0, m=0, s=0, ms=0) => {
    z.tuple([z.string(), zxs.int, zxs.int, zxs.int, zxs.int]).parse([str, h, m, s, ms]);
    const ymdEx = YMD_RE.exec(str);
    let newDate;
    if (ymdEx) {
        newDate = new Date(0);
        newDate.setFullYear(parseInt(ymdEx[1]), parseInt(ymdEx[2] - 1), parseInt(ymdEx[3]));
        newDate.setHours(0);  // work-around for issue mentioned in function JSDoc above
    } else {
        newDate = new Date(str);
    }
    return h || m || s || ms ?
      new Date(newDate.getTime() + h*60*60*1000 + m*60*1000 + s*1000 + ms) : newDate;
};

export const plusify = (n, decimals) => {
    z.tuple([z.number(), zxs.int]).parse([n, decimals]);
    const truncated = Number(n.toFixed(decimals));
    const str = truncated < 0 ? String(truncated) : `+${truncated}`;
    const ex = /[.](\d*)/.exec(str);
    if (!ex) return str + "." + "0".repeat(decimals);  // eslint-disable-line prefer-template
    if (ex[1].length === decimals) return str;
    return str + "0".repeat(decimals - ex[1].length);  // eslint-disable-line prefer-template
};

/*
 * Clone a date with specified hour, minute, second offsets (or no offsets).
 *
 * @param date Date
 * @param h hour offset, optional integer
 * @param m minute offset, optional integer
 * @param s second offset, optional integer
 * @param ms millisecond offset, optional integer
 */
export const offsetDate = (date, h=0, m=0, s=0, ms=0) => {
    z.tuple([z.date(), zxs.int, zxs.int, zxs.int, zxs.int]).parse([date, h, m, s, ms]);
    const newDate = new Date(date);
    return h || m || s || ms ?
      new Date(newDate.getTime() + h*60*60*1000 + m*60*1000 + s*1000 + ms) : newDate;
};
