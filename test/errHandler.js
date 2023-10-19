import { AppErr, mkConciseErrorHandler } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';

describe("es6 apputils 'errHandler' function", () => {
    it("rethrow", () => {
        assert.throws(() => mkConciseErrorHandler()(new AppErr("Pass-thru")), AppErr);
    });

    it("swallow", () => {
        mkConciseErrorHandler(null)(new AppErr("Swallow"));
    });
});
