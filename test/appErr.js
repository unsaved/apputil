"use strict";

const AppErr = require("../AppErr");
const assert = require("node:assert/strict");

describe("apputils 'mkDate' function", () => {
    it("AppError available", () => {
        assert.throws(() => { throw new AppErr("testing"); }, AppErr);
    });
});
