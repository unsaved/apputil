import { plusify } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';
import { ZodError } from "zod";

describe("es6 apputils 'plusify' function", () => {
    it("bad params", () => {
        assert.throws(() => { plusify(); }, ZodError);
        assert.throws(() => { plusify(3, 4.5); }, ZodError);
    });
    it("padding and preserving -", () => {
        assert.strictEqual("-1.200", plusify(-1.2, 3));
    });
    it("rounding and adding +", () => {
        assert.strictEqual("+3.1416", plusify(Math.PI, 4));
    });
});
