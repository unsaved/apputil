import { AppErr, conciseErrorHandler } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';

describe("apputils 'errHandler' function", () => {
    it("rethrows", () => {
        assert.throws(() => conciseErrorHandler(new AppErr("Pass-thru")), AppErr);
    });
});
