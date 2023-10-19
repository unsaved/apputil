"use strict";

const { AppErr } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");

describe("es5 apputils 'AppErr' class", () => {
    it("AppError available", () => {
        assert.throws(() => { throw new AppErr("testing"); }, AppErr);
    });
});
