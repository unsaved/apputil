import { AppErr } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';

describe("es6 apputils 'AppErr' class", () => {
    it("AppError available", () => {
        assert.throws(() => { throw new AppErr("testing"); }, AppErr);
    });
});
