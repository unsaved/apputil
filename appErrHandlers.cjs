"use strict";

const { validate } = require("@admc.com/bycontract-plus");
const AppErr = require("./AppErr.cjs");

/**
 * This encapsulates handling of expected exceptions in a way that supports
 * both main thread and async threads.
 *
 * @param exitValue defaults to no-exit-value.  I.e. will never exit.
 *   If set to a positive integer and if function execution throws
 *   anything then after generating appropriate text output, we will
 *   exit the process with the given return value.
 */
module.exports.conciseCatcher = function(wrappedFn, exitValue) {
    validate(arguments, ["function", "posint="]);
    return function() {
        try {
            return wrappedFn.apply(null, arguments);
        } catch (e) {
            if (e === null)
                console.error("A null was thrown.  Try using 'node --trace-uncaught' "
                  + "if you need the stack trace");
            else if (typeof e !== "object")
                console.error(`A ${typeof e} (non-object) was thrown.  `
                  + "Try using 'node --trace-uncaught' if you need the stack trace");
            else if (!("stack" in e))
                console.error(`An object with no stack was thrown.  `
                  + "Try using 'node --trace-uncaught' if you need the stack trace");
            else if (e.name === "AppErr")
                console.error(`Aborting.  ${e.message}`);
            else
                // Weakness here is that you lose OOTB display of the actual
                // source line of code.  Since AppErr will be thrown far
                // more often, this is acceptable.
                console.error(e.stack);
            if (exitValue !== undefined) process.exit(exitValue);
            return undefined;
        }
    };
};

/**
 * Reporting behavior dependson whether an AppErr was thrown.
 * Concise message for App Errors; otherwise NO reporting if exitValue null (with re-throw)
 * and output stack trace if non-null (incl. unset) exitValue.
 *
 * Disposition behavior depends on exitValue parameter.
 * IF exitValue is unset (undefined) then re-throw (if you don't re-catch then Node will dump stack)
 * IF exitValue is a positive integer then exit the process with that value.
 * IF exitValue is null then do nothing after reporting (program execution will continue).
 *
 * To be concise and just exit upon error, just set exitValue to a positive integer.
 * To be just get an error report and have your program continue, just set exitValue to null.
 * By default we will propagate the Error.  (So that errors can not go unnoticed by default).
 *
 * @param exitValue defaults to rethrow behavior.  I.e. will never exit.
 *        if null then we just return after reporting.
 *        If a positive nteger then we will exit with that value.
 */
module.exports.mkConciseErrorHandler = function(exitValue) {
    validate(arguments, ["posint="]);

    return function(e) {
        // First reporting:
        if (e === null) console.error("A null was thrown.  There's no way to distinguish further.");
        else if (typeof e !== "object")
            console.error(`A ${typeof e} was thrown.  There's no way to distinguish further.`);
        else if (!("stack" in e)) console.error(
          `An object with o stack trace  was thrown.  There's no way to distinguish further.`);
        else if (e instanceof AppErr)
            console.error(`Aborting.  ${e.message}`);
        else if (exitValue !== null)
            console.error(e.stack);  // Since Node will not be able to report about source, we do.

        // Disposition
        switch (exitValue) {
            // Node will show source code line, stack trace, and Error-implementor msg. if not
            // caught again:
            case undefined: throw e;
            case null: return;  // purposefully no default
        }
        if (exitValue !== undefined) process.exit(exitValue);
    };
};
