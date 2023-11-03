import { offsetDate } from "../apputil-deno.mjs";
import { assertStrictEquals, assertThrows } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { ZodError } from "https://deno.land/x/zod/mod.ts";

Deno.test("apputils 'offsetDate' function", async t => {
    await t.step("non-date param", async () => {
        assertThrows(() => { offsetDate(null); }, ZodError);
        assertThrows(() => { offsetDate(null, 1, 2, 3); }, ZodError);
        assertThrows(() => { offsetDate(null, 1, 2, 3, 4); }, ZodError);
        assertThrows(() => { offsetDate(1); }, ZodError);
        assertThrows(() => { offsetDate("str"); }, ZodError);
        assertThrows(() => { offsetDate(1, 1, 2, 3); }, ZodError);
        assertThrows(() => { offsetDate(1, 1, 2, 3, 4); }, ZodError);
        assertThrows(() => { offsetDate("str", 1, 2, 3); }, ZodError);
        assertThrows(() => { offsetDate("str", 1, 2, 3, 4); }, ZodError);
    });
    await t.step("non-integer param", async () => {
        assertThrows(() => { offsetDate(); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), null); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1, null); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1, 2, null); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1, 2, 3, null); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), "str"); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1, "str"); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1, 2, "str"); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1, 2, 3, "str"); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1.2); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1, 1.2); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1, 2, 1.2); }, ZodError);
        assertThrows(() => { offsetDate(new Date(), 1, 2, 3, 1.2); }, ZodError);
    });
    await t.step("clone a Date", async () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const cloneDate = offsetDate(newDate);
        assertStrictEquals(cloneDate.getTime(), newDate.getTime());
    });
    await t.step("positive offsets", async () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const adjDate = offsetDate(newDate, 20, 30, 40, 50);
        assertStrictEquals(adjDate.getTime(),
          newDate.getTime() + 20*60*60*1000 + 30*60*1000 + 40*1000 + 50);
    });
    await t.step("negative offsets", async () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const adjDate = offsetDate(newDate, -20, -30, -40, -50);
        assertStrictEquals(adjDate.getTime(),
          newDate.getTime() - 20*60*60*1000 - 30*60*1000 - 40*1000 - 50);
    });
    await t.step("offset mix", async () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const adjDate = offsetDate(newDate, 20, undefined, -40);
        assertStrictEquals(adjDate.getTime(), newDate.getTime() + 20*60*60*1000 - 40*1000);
    });
});
