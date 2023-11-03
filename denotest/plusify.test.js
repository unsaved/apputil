import { plusify } from "../apputil-deno.mjs";
import { assertStrictEquals, assertThrows } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { ZodError } from "https://deno.land/x/zod/mod.ts";

Deno.test("apputils 'plusify' function", async t => {
    await t.step("bad params", async () => {
        assertThrows(() => { plusify(); }, ZodError);
        assertThrows(() => { plusify(3, 4.5); }, ZodError);
    });
    await t.step("padding and preserving -", async () => {
        assertStrictEquals(plusify(-1.2, 3), "-1.200");
    });
    await t.step("rounding and adding +", async () => {
        assertStrictEquals(plusify(Math.PI, 4), "+3.1416");
    });
});
