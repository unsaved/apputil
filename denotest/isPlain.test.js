import { isPlainObject } from "../apputil-deno.mjs";
import { assert } from "https://deno.land/std@0.204.0/assert/mod.ts";

Deno.test("apputils 'isPlainObject' function", async t => {
    await t.step("positives", async () => {
        assert(isPlainObject({}));
        assert(isPlainObject({alpha: 1}));
    });
    await t.step("non-objects", () => {
        assert(!isPlainObject(undefined));
        assert(!isPlainObject(null));
        assert(!isPlainObject(3));
        assert(!isPlainObject(/re/));
        assert(!isPlainObject(new Date()));
        assert(!isPlainObject(Date));
        assert(!isPlainObject(true));
        assert(!isPlainObject([]));
        assert(!isPlainObject([1, 2]));
    });
});
