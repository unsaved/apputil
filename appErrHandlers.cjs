"use strict";

const AppErr = require("./AppErr.cjs");

/**
 * Factory returning a throwable handler: reports to stderr in a type-aware way,
 * then exits, rethrows, or returns based on exitCode.
 *
 * Built-in reporting (fires only when no .handle() registration matches):
 *   AppErr        → concise message, no stack trace
 *   Other Error   → full stack trace
 *   Anything else → console.error() as-is
 *
 * @param {number|null} [exitCode]  integer → process.exit(exitCode); null → rethrow; omit → return
 * @returns {Function} handler, with chainable .handle(ErrorClass, reporterFn) method
 */
module.exports.mkAppThrowableHandler = function(exitCode) {
    if (exitCode !== null && exitCode !== undefined && !Number.isInteger(exitCode))
        throw new TypeError(
          `mkAppThrowableHandler: exitCode must be an integer, null, or undefined, got ${exitCode}`
        );
    const appHandlers = [];
    const handler = throwable => {
        let appHandled = false;
        for (const [cls, fn] of appHandlers) {
            if (throwable instanceof cls) { fn(throwable); appHandled = true; break; }
        }
        if (!appHandled) {
            if (throwable instanceof AppErr)
                console.error(`AppErr: ${throwable.message}`);
            else if (throwable instanceof Error)
                console.error(throwable.stack ?? throwable);
            else
                console.error(throwable);
        }
        if (exitCode === null) throw throwable;
        if (exitCode !== undefined) process.exit(exitCode);
    };
    handler.handle = (cls, fn) => { appHandlers.push([cls, fn]); return handler; };
    return handler;
};

