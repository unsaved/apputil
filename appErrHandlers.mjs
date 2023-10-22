import AppErr from "./AppErr.mjs";
import z from "zod";
import zxs from "./zod-extra-schemas.mjs";

/**
 * This encapsulates handling of expected exceptions in a way that supports
 * both main thread and async threads.
 *
 * Error-reporting behavior is as documented by the mkConciseErrorHandler fuction below.
 * We use that function, passing it the exitValue parameter.
 */
export function conciseCatcher(wrappedFn, exitValue) {
    z.tuple([z.function(), zxs.posint.nullish()]).parse(zxs.argsTuplify(arguments, 2));
    const errHandler = mkConciseErrorHandler(exitValue);
    return function() {
        try {
            return wrappedFn.apply(null, arguments);
        } catch (e) {
            errHandler(e);
            return undefined;
        }
    };
}

/**
 * Reporting behavior dependson whether an AppErr or ZodError was thrown.
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
export function mkConciseErrorHandler(exitValue) {
    z.tuple([zxs.posint.nullish()]).parse(zxs.argsTuplify(arguments, 1));

    return function(e) {
        // First reporting:
        if (e === null) console.error("A null was thrown.  There's no way to distinguish further.");
        else if (typeof e !== "object")
            console.error(`A ${typeof e} was thrown.  There's no way to distinguish further.`);
        else if (!("stack" in e)) console.error(
          `An object with o stack trace  was thrown.  There's no way to distinguish further.`);
        else if (e instanceof AppErr)
            console.error(`AppErr.  ${e.message}`);
        else if (e instanceof z.ZodError)
            console.error(
              e.stack.split("\n").filter(l=>/^ {4}at .+:\d+:\d+\)$/m.test(l)).join("\n"),
              "ZodError", e.errors[0].message);
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
}
