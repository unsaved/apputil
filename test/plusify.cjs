"use strict";

const { plusify } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");
const { ZodError } = require("zod");

describe("es5 apputils 'plusify' function", () => {
    it("bad params", () => {
        assert.throws(() => { plusify(); }, ZodError);
        assert.throws(() => { plusify(3, 4.5); }, ZodError);
    });
    it("padding and preserving -", () => {
        assert.strictEqual(plusify(-1.2, 3), "-1.200");
    });
    it("rounding and adding +", () => {
        assert.strictEqual(plusify(Math.PI, 4), "+3.1416");
    });
});
