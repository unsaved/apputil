"use strict";

const { AppErr, mkAppThrowableHandler } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");

describe("es5 apputils 'mkAppThrowableHandler' function", () => {
    describe("exitCode validation", () => {
        it("rejects non-integer non-null", () => {
            assert.throws(() => mkAppThrowableHandler(1.5), TypeError);
            assert.throws(() => mkAppThrowableHandler("1"), TypeError);
        });
        it("accepts undefined, null, integer", () => {
            assert.doesNotThrow(() => mkAppThrowableHandler());
            assert.doesNotThrow(() => mkAppThrowableHandler(null));
            assert.doesNotThrow(() => mkAppThrowableHandler(1));
        });
    });
    describe("undefined exitCode (return mode)", () => {
        it("returns for AppErr", () =>
            assert.doesNotThrow(() => mkAppThrowableHandler()(new AppErr("return")))
        );
        it("returns for plain Error", () =>
            assert.doesNotThrow(() => mkAppThrowableHandler()(new Error("return")))
        );
        it("returns for non-Error throwable", () =>
            assert.doesNotThrow(() => mkAppThrowableHandler()("a string"))
        );
    });
    describe("null exitCode (rethrow mode)", () => {
        it("rethrows AppErr", () =>
            assert.throws(() => mkAppThrowableHandler(null)(new AppErr("rethrow")), AppErr)
        );
        it("rethrows plain Error", () =>
            assert.throws(() => mkAppThrowableHandler(null)(new Error("rethrow")), Error)
        );
        it("rethrows non-Error throwable", () =>
            assert.throws(() => mkAppThrowableHandler(null)("a string"))
        );
    });
    describe(".handle() method", () => {
        it("custom handler fires for matching class", () => {
            let fired = false;
            mkAppThrowableHandler().handle(AppErr, () => { fired = true; })(new AppErr("test"));
            assert.ok(fired);
        });
        it("built-in fallback fires when no match", () => {
            let fired = false;
            mkAppThrowableHandler().handle(TypeError, () => { fired = true; })(new AppErr("test"));
            assert.ok(!fired);
        });
        it("first matching handle wins", () => {
            let firedFirst = false;
            let firedSecond = false;
            mkAppThrowableHandler().
              handle(AppErr, () => { firedFirst = true; }).
              handle(Error, () => { firedSecond = true; })(new AppErr("test"));
            assert.ok(firedFirst);
            assert.ok(!firedSecond);
        });
        it("rethrows after custom handler fires with null exitCode", () => {
            let fired = false;
            const handler = mkAppThrowableHandler(null).handle(AppErr, () => { fired = true; });
            assert.throws(() => handler(new AppErr("test")), AppErr);
            assert.ok(fired);
        });
        it("returns handler for chaining", () => {
            const handler = mkAppThrowableHandler();
            assert.strictEqual(handler.handle(AppErr, () => {}), handler);
        });
    });
});
