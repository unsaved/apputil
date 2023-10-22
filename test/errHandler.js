import { AppErr, mkConciseErrorHandler, conciseCatcher } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';
import { ZodError } from "zod";

describe("es6 apputils 'errHandler' functions", () => {
    describe("mkConciseErrorHandler function", () => {
        it("rethrow", () => {
            assert.throws(() => mkConciseErrorHandler()(new AppErr("Pass-thru AppErr")), AppErr);
            assert.throws(() =>
              mkConciseErrorHandler()(new ZodError("Pass-thru ZodError")), ZodError);
        });
        it("swallow", () => {
            mkConciseErrorHandler(null)(new AppErr("Swallow"));
        });
    });
    describe("conciseCatcher function", () => {
        it("rethrow", () => {
            assert.throws(() => conciseCatcher(
                () => { throw new AppErr("Pass-thru AppErr"); }
            )(), AppErr);
            assert.throws(() => conciseCatcher(
                () => { throw new ZodError("Pass-thru ZodError"); }
            )(), ZodError);
        });
        it("swallow", () =>
            conciseCatcher(() => { throw new AppErr("Swallow"); }, null)()
        );
    });
});
