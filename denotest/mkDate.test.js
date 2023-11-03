import { mkDate } from "../apputil-deno.mjs";
import { assert, assertStrictEquals, assertThrows }
  from "https://deno.land/std@0.204.0/assert/mod.ts";
import { ZodError } from "https://deno.land/x/zod/mod.ts";

Deno.test("apputils 'mkDate' function", async t => {
    await t.step("param not a string", async () => {
        assertThrows(() => { mkDate(null); }, ZodError);
        assertThrows(() => { mkDate(123); }, ZodError);
    });
    await t.step("generate a default Date", async () => {
        const newDate = mkDate("2023-04-05T01:02:03.345Z");
        assert(newDate instanceof Date);
        assertStrictEquals(newDate.getUTCHours(), 1);
        assertStrictEquals(newDate.getUTCMinutes(), 2);
        assertStrictEquals(newDate.getUTCSeconds(), 3);
        assertStrictEquals(newDate.getUTCMilliseconds(), 345);
    });
    await t.step("generate a default Date with offset", async () => {
        const newDate = mkDate("2023-04-05T01:02:03.345Z", 0, 0, 2, -4);
        assert(newDate instanceof Date);
        assertStrictEquals(newDate.getUTCHours(), 1);
        assertStrictEquals(newDate.getUTCMinutes(), 2);
        assertStrictEquals(newDate.getUTCSeconds(), 5);
        assertStrictEquals(newDate.getUTCMilliseconds(), 341);
    });
    await t.step("generate a time-zeroed Date", async () => {
        const newDate = mkDate("2023-04-05");
        assert(newDate instanceof Date);
        assertStrictEquals(newDate.getHours(), 0);
        assertStrictEquals(newDate.getMinutes(), 0);
        assertStrictEquals(newDate.getSeconds(), 0);
        assertStrictEquals(newDate.getMilliseconds(), 0);
    });
    await t.step("generate a time-zeroed Date with offset", async () => {
        const newDate = mkDate("2023-04-05", 2, 3, 4, 5);
        assert(newDate instanceof Date);
        assertStrictEquals(newDate.getHours(), 2);
        assertStrictEquals(newDate.getMinutes(), 3);
        assertStrictEquals(newDate.getSeconds(), 4);
        assertStrictEquals(newDate.getMilliseconds(), 5);
    });
    await t.step("generate a default Date with negative offsets", async () => {
        const baseDate = new Date("2023-04-05T01:02:03.345Z");
        assert(baseDate instanceof Date);
        const newDate = mkDate("2023-04-05T01:02:03.345Z", -2, -3, -4, -5);
        assert(newDate instanceof Date);
        assertStrictEquals(newDate.getTime(),
          baseDate.getTime() - 2 * 60*60*1000 - 3 * 60*1000 - 4 * 1000 -5);
    });
});
