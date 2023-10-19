"use strict";

const { plusify } = require("../index");
const assert = require("node:assert/strict");

describe("apputils 'plusify' function", () => {
    it("bad params", () => {
        assert.throws(() => { plusify(); }, TypeError);
        assert.throws(() => { plusify(3, 4.5); }, TypeError);
    });
    it("padding and preserving -", () => {
        assert.strictEqual("-1.200", plusify(-1.2, 3));
    });
    it("rounding and adding +", () => {
        assert.strictEqual("+3.1416", plusify(Math.PI, 4));
    });
});
