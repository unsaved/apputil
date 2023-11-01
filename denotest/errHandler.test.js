import { AppErr, mkConciseErrorHandler, conciseCatcher } from "../apputil-deno.mjs";
import { assertThrows } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { ZodError } from "https://deno.land/x/zod/mod.ts";

Deno.test("apputils 'errHandler' / mkConciseErrorHandler function", async t => {
    await t.step("rethrow", async () => {
        assertThrows(() => mkConciseErrorHandler()(new AppErr("Pass-thru AppErr")), AppErr);
        assertThrows(() => mkConciseErrorHandler()(new ZodError("Pass-thru ZodError")), ZodError);
    });
    await t.step("swallow", async () => {
        mkConciseErrorHandler(null)(new AppErr("Swallow"));
    });
});
Deno.test("apputils 'errHandler' / conciseCatcher function", async t => {
    await t.step("rethrow", async () => {
        assertThrows(() =>
          conciseCatcher( () => { throw new AppErr("Pass-thru AppErr"); })(), AppErr);
        assertThrows(() =>
          conciseCatcher( () => { throw new ZodError("Pass-thru ZodError"); })(), ZodError);
    });
    await t.step("swallow", async () =>
        conciseCatcher(() => { throw new AppErr("Swallow"); }, null)()
    );
});
