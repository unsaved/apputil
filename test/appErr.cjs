"use strict";

const { AppErr } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");

describe("apputils 'AppErr' class", () => {
    it("AppError available", () => {
        assert.throws(() => { throw new AppErr("testing"); }, AppErr);
    });
});
