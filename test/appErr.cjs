"use strict";

const { AppErr } = require("../apputil.cjs");
const assert = require("node:assert/strict");

describe("apputils 'mkDate' function", () => {
    it("AppError available", () => {
        assert.throws(() => { throw new AppErr("testing"); }, AppErr);
    });
});
