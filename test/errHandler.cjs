"use strict";

const { AppErr, conciseErrorHandler } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");

describe("apputils 'errHandler' function", () => {
    it("rethrows", () => {
        assert.throws(() => conciseErrorHandler(new AppErr("Pass-thru")), AppErr);
    });
});
