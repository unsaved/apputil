import { zxs } from "../apputil-deno.mjs";
import { assert } from "https://deno.land/std@0.204.0/assert/mod.ts";

Deno.test("extra Zod schemas / int", async t => {
    await t.step("good data", async () => {
        assert(zxs.int.safeParse(3).success, "positive");
        assert(zxs.int.safeParse(-3).success, "negative");
        assert(zxs.int.safeParse(0).success, "zero");
        assert(zxs.int.safeParse(0.00).success, "zero non-init"); // converts to int
        assert(zxs.int.optional().safeParse(-3).success, "negative w/optional");
        assert(zxs.int.nullable().safeParse(0).success, "zero w/nullable");
        assert(zxs.int.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.int.nullable().safeParse(null).success, "null w/nullable");
    });
    await t.step("bad data", async () => {
        assert(!zxs.int.safeParse("str").success, "non-number");
        assert(!zxs.int.safeParse(null).success, "null");
        assert(!zxs.int.safeParse(Math.PI).success, "non-int");
    });
});
Deno.test("extra Zod schemas / posint", async t => {
    await t.step("good data", async () => {
        assert(zxs.posint.safeParse(3).success, "simple");
        assert(zxs.posint.optional().safeParse(3).success, "simple w/optional");
        assert(zxs.posint.nullable().safeParse(3).success, "simple w/nullable");
        assert(zxs.posint.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.posint.nullable().safeParse(null).success, "null w/nullable");
    });
    await t.step("bad data", async () => {
        assert(!zxs.posint.safeParse("str").success, "non-number");
        assert(!zxs.posint.safeParse(null).success, "null");
        assert(!zxs.posint.safeParse(-3).success, "negative");
        assert(!zxs.posint.safeParse(0).success, "zero int");
        assert(!zxs.posint.safeParse(0.00).success, "zero non-int");  // converts
        assert(!zxs.posint.safeParse(Math.PI).success, "non-int");
    });
});
Deno.test("extra Zod schemas / nonnegint", async t => {
    await t.step("good data", async () => {
        assert(zxs.nonnegint.safeParse(3).success, "simple");
        assert(zxs.nonnegint.optional().safeParse(3).success, "simple w/optional");
        assert(zxs.nonnegint.nullable().safeParse(3).success, "simple w/nullable");
        assert(zxs.nonnegint.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.nonnegint.nullable().safeParse(null).success, "null w/nullable");
        assert(zxs.nonnegint.safeParse(0).success, "zero int");
        assert(zxs.nonnegint.safeParse(0.00).success, "zero nonint");  // converts
    });
    await t.step("bad data", async () => {
        assert(!zxs.nonnegint.safeParse("str").success, "non-number");
        assert(!zxs.nonnegint.safeParse(null).success, "null");
        assert(!zxs.nonnegint.safeParse(-3).success, "negative");
        assert(!zxs.nonnegint.safeParse(Math.PI).success, "non-int");
    });
});
Deno.test("extra Zod schemas / pos", async t => {
    await t.step("good data", async () => {
        assert(zxs.positive.safeParse(3).success, "simple");
        assert(zxs.positive.optional().safeParse(3).success, "simple w/optional");
        assert(zxs.positive.nullable().safeParse(3).success, "simple w/nullable");
        assert(zxs.positive.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.positive.nullable().safeParse(null).success, "null w/nullable");
        assert(zxs.positive.safeParse(Math.PI).success, "non-int");
    });
    await t.step("bad data", async () => {
        assert(!zxs.positive.safeParse("str").success, "non-number");
        assert(!zxs.positive.safeParse(null).success, "null");
        assert(!zxs.positive.safeParse(-3).success, "negative");
        assert(!zxs.positive.safeParse(0).success, "zero int");
        assert(!zxs.positive.safeParse(0.00).success, "zero non-int");  // converts
    });
});
Deno.test("extra Zod schemas / nonneg", async t => {
    await t.step("good data", async () => {
        assert(zxs.nonneg.safeParse(3).success, "simple");
        assert(zxs.nonneg.optional().safeParse(3).success, "simple w/optional");
        assert(zxs.nonneg.nullable().safeParse(3).success, "simple w/nullable");
        assert(zxs.nonneg.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.nonneg.nullable().safeParse(null).success, "null w/nullable");
        assert(zxs.nonneg.safeParse(Math.PI).success, "non-int");
        assert(zxs.nonneg.safeParse(0).success, "zero int");
        assert(zxs.nonneg.safeParse(0.00).success, "zero non-int");  // converts
    });
    await t.step("bad data", async () => {
        assert(!zxs.nonneg.safeParse("str").success, "non-number");
        assert(!zxs.nonneg.safeParse(null).success, "null");
        assert(!zxs.nonneg.safeParse(-3).success, "negative");
    });
});
Deno.test("extra Zod schemas / strictdatestr", async t => {
    await t.step("good data", async () => {
        assert(zxs.strictdatestr.safeParse("2021-12-30").success, "simple");
        assert(zxs.strictdatestr.optional().safeParse("2021-12-30").success, "simple w/optional");
        assert(zxs.strictdatestr.nullable().safeParse("2021-12-30").success, "simple w/nullable");
        assert(zxs.strictdatestr.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.strictdatestr.nullable().safeParse(null).success, "null w/nullable");
    });
    await t.step("bad data", async () => {
        assert(!zxs.strictdatestr.safeParse(3).success, "non-string");
        assert(!zxs.strictdatestr.safeParse(null).success, "null");
        assert(!zxs.strictdatestr.safeParse("").success, "empty string");
        assert(!zxs.strictdatestr.safeParse("bad").success, "undate string");
        assert(!zxs.strictdatestr.safeParse("2021-2-30").success, "no leading month 0");
        assert(!zxs.strictdatestr.safeParse("2021-02-3").success, "no leading day 0");
        assert(!zxs.strictdatestr.safeParse("2021-02-03Z").success, "trailing char");
    });
});
Deno.test("extra Zod schemas / datestr", async t => {
    await t.step("good data", async () => {
        assert(zxs.datestr.safeParse("2021-12-30").success, "simple");
        assert(zxs.datestr.optional().safeParse("2021-12-30").success, "simple w/optional");
        assert(zxs.datestr.nullable().safeParse("2021-12-30").success, "simple w/nullable");
        assert(zxs.datestr.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.datestr.nullable().safeParse(null).success, "null w/nullable");
        assert(zxs.datestr.safeParse("2021-2-30").success, "no leading month 0");
        assert(zxs.datestr.safeParse("2021-02-3").success, "no leading day 0");
    });
    await t.step("bad data", async () => {
        assert(!zxs.datestr.safeParse(3).success, "bad data");
        assert(!zxs.datestr.safeParse(null).success, "null");
        assert(!zxs.datestr.safeParse("").success, "empty string");
        assert(!zxs.datestr.safeParse("bad").success, "undate string");
        assert(!zxs.datestr.safeParse("2021-02-03Z").success, "trailing char");
        assert(!zxs.datestr.safeParse("2021/12/30").success, "wrong delimiter");
    });
});
Deno.test("extra Zod schemas / slashydatestr", async t => {
    await t.step("good data", async () => {
        assert(zxs.slashydatestr.safeParse("2021/12/30").success, "simple");
        assert(zxs.slashydatestr.optional().safeParse("2021/12/30").success, "simple w/optional");
        assert(zxs.slashydatestr.nullable().safeParse("2021/12/30").success, "simple w/nullable");
        assert(zxs.slashydatestr.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.slashydatestr.nullable().safeParse(null).success, "null w/nullable");
        assert(zxs.slashydatestr.safeParse("2021/2/30").success, "no leading month 0");
        assert(zxs.slashydatestr.safeParse("2021/02/3").success, "no leading day 0");
    });
    await t.step("bad data", async () => {
        assert(!zxs.slashydatestr.safeParse(3).success, "non-string");
        assert(!zxs.slashydatestr.safeParse(null).success, "null");
        assert(!zxs.slashydatestr.safeParse("").success, "empty string");
        assert(!zxs.slashydatestr.safeParse("bad").success, "undate string");
        assert(!zxs.slashydatestr.safeParse("2021/02/03Z").success, "trailing char");
        assert(!zxs.slashydatestr.safeParse("2021-12-30").success, "wrong delimiter");
    });
});
Deno.test("extra Zod schemas / plainobject", async t => {
    await t.step("good data", async () => {
        assert(zxs.plainobject.safeParse({}).success, "empty obj");
        assert(zxs.plainobject.safeParse({alpha: 1}).success, "simple obj");
        assert(zxs.plainobject.optional().safeParse({}).success, "simple w/optional");
        assert(zxs.plainobject.nullable().safeParse({alpha: 2}).success, "simple w/nullable");
        assert(zxs.plainobject.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.plainobject.nullable().safeParse(null).success, "null w/nullable");
    });
    await t.step("bad data", async () => {
        assert(!zxs.plainobject.safeParse(3).success, "non-string");
        assert(!zxs.plainobject.safeParse(null).success, "null");
        assert(!zxs.plainobject.safeParse("bad").success, "undate string");
        assert(!zxs.plainobject.safeParse(3).success, "integer");
        //it("RegExp", () => assert(!zxs.plainobject.safeParse(/re/).success, "RegExp");
        assert(!zxs.plainobject.safeParse(new Date()).success, "Date");
        assert(!zxs.plainobject.safeParse(Date).success, "Class");
        assert(!zxs.plainobject.safeParse(true).success, "boolean");
        assert(!zxs.plainobject.safeParse([]).success, "array array");
        assert(!zxs.plainobject.safeParse([1, 2]).success, "populated array");
    });
});
Deno.test("extra Zod schemas / isotimestr", async t => {
    await t.step("bad data", async () => {
        assert(!zxs.isotimestr.safeParse(3).success, "non-string");
        assert(!zxs.isotimestr.safeParse(null).success, "null");
        assert(!zxs.isotimestr.safeParse("").success, "empty string");
        assert(!zxs.isotimestr.safeParse("2021-22-13T23:24:25+04:00").success,
          "invalid date components/A");
        assert(!zxs.isotimestr.safeParse("2021-12-43T23:24:25+04:00").success,
          "invalid date components/B");
        assert(!zxs.isotimestr.safeParse("2021-2-13T23:24:25+04:00").success,
          "invalid date components/C");
        assert(!zxs.isotimestr.safeParse("2021-12-3T23:24:25+04:00").success,
          "invalid date components/D");
        assert(
          !zxs.isotimestr.safeParse("2021-22-13T23:24:25Z").success, "invalid date components/E");
        assert(
          !zxs.isotimestr.safeParse("2021-12-43T23:24:25Z").success, "invalid date components/F");
        assert(
          !zxs.isotimestr.safeParse("2021-2-13T23:24:25Z").success, "invalid date components/G");
        assert(
          !zxs.isotimestr.safeParse("2021-12-3T23:24:25Z").success, "invalid date components/H");
        assert(
          !zxs.isotimestr.safeParse("21-12-13T23:24:25+04:00").success, "missing date chars/A");
        assert(
          !zxs.isotimestr.safeParse("2021-2-13T23:24:25+04:00").success, "missing date chars/B");
        assert(
          !zxs.isotimestr.safeParse("2021-12-3T23:24:25+04:00").success, "missing date chars/C");
        assert(!zxs.isotimestr.safeParse("21-12-13T23:24:25Z").success, "missing date chars/D");
        assert(!zxs.isotimestr.safeParse("2021-2-13T23:24:25Z").success, "missing date chars/E");
        assert(!zxs.isotimestr.safeParse("2021-12-3T23:24:25Z").success, "missing date chars/F");
        assert(!zxs.isotimestr.safeParse("21-12-13T23:24:25").success, "missing date chars/G");
        assert(!zxs.isotimestr.safeParse("2021-2-13T23:24:25").success, "missing date chars/H");
        assert(!zxs.isotimestr.safeParse("2021-12-3T23:24:25").success, "missing date chars/I");
        assert(!zxs.isotimestr.safeParse("2021-12-13T23:24:2").success, "missing date chars/J");
        assert(!zxs.isotimestr.safeParse("2021-12-13T23:24:2Z").success, "missing date chars/K");
        assert(!zxs.isotimestr.safeParse("2021-12-13T23:2:25").success, "missing date chars/L");
        assert(!zxs.isotimestr.safeParse("2021-12-13T23:2:25Z").success, "missing date chars/M");
        assert(!zxs.isotimestr.safeParse("2021-12-13T2:24:25").success, "missing date chars/N");
        assert(!zxs.isotimestr.safeParse("2021-12-13T2:24:25Z").success, "missing date chars/O");
        assert(!zxs.isotimestr.safeParse("2021-12-13T23:24:25").success, "no zone indicator");
    });
    await t.step("good data", async () => {
        assert(
          zxs.isotimestr.optional().safeParse("2021-12-13T23:24:25Z").success, "simple w/optional");
        assert(
          zxs.isotimestr.nullable().safeParse("2021-12-13T23:24:25Z").success, "simple w/optional");
        assert(zxs.isotimestr.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.isotimestr.nullable().safeParse(null).success, "null w/nullable");
        assert(zxs.isotimestr.safeParse("2021-12-13T23:24:25Z").success, "Z zone");
        assert(zxs.isotimestr.safeParse("2021-12-13T23:24:25+04:00").success, "+/- zone offset/A");
        assert(zxs.isotimestr.safeParse("2021-12-13T23:24:25-04:00").success, "+/- zone offset/B");
    });
});
Deno.test("extra Zod schemas / isotimestr_s", async t => {
    await t.step("bad data", async () => {
        assert(!zxs.isotimestr_s.safeParse(3).success, "non-string");
        assert(!zxs.isotimestr_s.safeParse(null).success, "null");
        assert(!zxs.isotimestr_s.safeParse("").success, "empty string");
        assert(
          !zxs.isotimestr_s.safeParse("2021-22-13T23:24:25").success, "invalid date components/A");
        assert(
          !zxs.isotimestr_s.safeParse("2021-12-43T23:24:25").success, "invalid date components/B");
        assert(
          !zxs.isotimestr_s.safeParse("2021-2-13T23:24:25").success, "invalid date components/C");
        assert(
          !zxs.isotimestr_s.safeParse("2021-12-3T23:24:25").success, "invalid date components/D");
        assert(
          !zxs.isotimestr_s.safeParse("2021-12-3T23:24:2").success, "invalid date components/E");
        assert(!zxs.isotimestr_s.safeParse("21-12-13T23:24:25").success, "missing date chars/A");
        assert(!zxs.isotimestr_s.safeParse("2021-2-13T23:24:25").success, "missing date chars/B");
        assert(!zxs.isotimestr_s.safeParse("2021-12-3T23:24:25").success, "missing date chars/C");
        assert(!zxs.isotimestr_s.safeParse("21-12-13T23:24:25").success, "missing date chars/D");
        assert(!zxs.isotimestr_s.safeParse("2021-2-13T23:24:25").success, "missing date chars/E");
        assert(!zxs.isotimestr_s.safeParse("2021-12-3T23:24:25").success, "missing date chars/F");
        assert(!zxs.isotimestr_s.safeParse("2021-12-13T23:24:2").success, "missing date chars/G");
        assert(!zxs.isotimestr_s.safeParse("2021-12-13T23:2:25").success, "missing date chars/A");
        assert(!zxs.isotimestr_s.safeParse("2021-12-13T2:24:25").success, "missing date chars/H");
        assert(
          !zxs.isotimestr_s.safeParse("2021-12-13T23:24:25+04:00").success, "+/- zone offset/A");
        assert(
          !zxs.isotimestr_s.safeParse("2021-12-13T23:24:25-04:00").success, "+/- zone offset/B");
        assert(!zxs.isotimestr_s.safeParse("2021-12-13T23:24:25Z").success, "Z zone");
    });
    await t.step("good data", async () => {
        assert(zxs.isotimestr_s.optional().safeParse("2021-12-13T23:24:25").success,
          "simple w/optional");
        assert(zxs.isotimestr_s.nullable().safeParse("2021-12-13T23:24:25").success,
          "simple w/nullable");
        assert(zxs.isotimestr_s.optional().safeParse(undefined).success, "undefined w/optional");
        assert(zxs.isotimestr_s.nullable().safeParse(null).success, "null w/nullable");
    });
});
