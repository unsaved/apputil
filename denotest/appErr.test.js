import { AppErr } from "../apputil-deno.mjs";
import { assertThrows } from "https://deno.land/std@0.204.0/assert/mod.ts";

Deno.test("apputils 'AppErr' class", async t => {
    await t.step("AppError available", async () =>
        assertThrows(() => { throw new AppErr("testing"); }, AppErr)
    );
});
