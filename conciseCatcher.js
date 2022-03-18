"use strict";

const { validate } = require("bycontract-plus");

/**
 * This encapsulates handling of expected exceptions in a way that supports
 * both main thread and async threads.
 *
 * @param exitValue defaults to no-exit-value.  I.e. will never exit.
 *   If set to a positive integer and if function execution throws
 *   anything then after generating appropriate text output, we will
 *   exit the process with the given return value.
 */
module.exports = function(wrappedFn, exitValue) {
    validate(arguments, ["function", "posint="]);
    return function() {
        try {
            return wrappedFn.apply(null, arguments);
        } catch(e) {
            if (e === null)
                console.error("A null was thrown.  "
                  + "Try using 'node --trace-uncaught' "
                  + "if you need the stack trace");
            else if (typeof(e) !== "object")
                console.error(`A ${typeof(e)} (non-object) was thrown.  `
                  + "Try using 'node --trace-uncaught' "
                  + "if you need the stack trace");
            else if (!("stack" in e))
                console.error(`An object with no stack was thrown.  `
                  + "Try using 'node --trace-uncaught' "
                  + "if you need the stack trace");
            else if (e.name === "AppErr")
                console.error("Aborting.  " + e.message);
            else
                // Weakness here is that you lose OOTB display of the actual
                // source line of code.  Since AppErr will be thrown far
                // more often, this is acceptable.
                console.error(e.stack);
            if (exitValue !== undefined) process.exit(exitValue);
        }
    };
};
