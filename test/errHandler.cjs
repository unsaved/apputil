"use strict";

const { AppErr, conciseErrorHandler } = require("../apputil.cjs");
const assert = require("node:assert/strict");

describe("apputils 'mkDate' function", () => {
    it("rethrows", () => {
        assert.throws(() => conciseErrorHandler(new AppErr("Pass-thru")), AppErr);
    });
});
