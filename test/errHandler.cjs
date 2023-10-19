"use strict";

const { AppErr, mkConciseErrorHandler } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");

describe("es5 apputils 'errHandler' function", () => {
    it("rethrow", () => {
        assert.throws(() => mkConciseErrorHandler()(new AppErr("Pass-thru")), AppErr);
    });

    it("swallow", () => {
        mkConciseErrorHandler(null)(new AppErr("Swallow"));
    });
});
