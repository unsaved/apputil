"use strict";

const zxs = require("../zod-extra-schemas.cjs");
const assert = require("node:assert/strict");

describe("es5 extra Zod schemas", () => {
    describe("int", () => {
        describe("good data", () => {
            it("positive", () => assert.ok(zxs.int.safeParse(3).success));
            it("negative", () => assert.ok(zxs.int.safeParse(-3).success));
            it("zero", () => assert.ok(zxs.int.safeParse(0).success));
            it("zero non-int", () => assert.ok(zxs.int.safeParse(0.00).success)); // converts to int
            it("negative w/optional", () => assert.ok(zxs.int.optional().safeParse(-3).success));
            it("zero w/nullable", () => assert.ok(zxs.int.nullable().safeParse(0).success));
            it("undefined w/optional", () => 
              assert.ok(zxs.int.optional().safeParse(undefined).success));
            it("null w/nullable", () => assert.ok(zxs.int.nullable().safeParse(null).success));
        });
        describe("bad data", () => {
            it("non-number", () => assert.ok(!zxs.int.safeParse("str").success));
            it("null", () => assert.ok(!zxs.int.safeParse(null).success));
            it("non-int", () => assert.ok(!zxs.int.safeParse(Math.PI).success));
        });
    });
    describe("posint", () => {
        describe("good data", () => {
            it("simple", () => assert.ok(zxs.posint.safeParse(3).success));
            it("simple w/optional", () => 
              assert.ok(zxs.posint.optional().safeParse(3).success));
            it("simple w/nullable", () => assert.ok(zxs.posint.nullable().safeParse(3).success));
            it("undefined w/optional", () => 
              assert.ok(zxs.posint.optional().safeParse(undefined).success));
            it("null w/nullable", () => assert.ok(zxs.posint.nullable().safeParse(null).success));
        });
        describe("bad data", () => {
            it("non-number", () => assert.ok(!zxs.posint.safeParse("str").success));
            it("null", () => assert.ok(!zxs.posint.safeParse(null).success));
            it("negative", () => assert.ok(!zxs.posint.safeParse(-3).success));
            it("zero int", () => assert.ok(!zxs.posint.safeParse(0).success));
            it("zero non-int", () => assert.ok(!zxs.posint.safeParse(0.00).success));  // converts
            it("non-int", () => assert.ok(!zxs.posint.safeParse(Math.PI).success));
        });
    });
    describe("nonnegint", () => {
        describe("good data", () => {
            it("simple", () => assert.ok(zxs.nonnegint.safeParse(3).success));
            it("simple w/optional", () => 
              assert.ok(zxs.nonnegint.optional().safeParse(3).success));
            it("simple w/nullable", () => assert.ok(zxs.nonnegint.nullable().safeParse(3).success));
            it("undefined w/optional", () => 
              assert.ok(zxs.nonnegint.optional().safeParse(undefined).success));
            it("null w/nullable", () =>
              assert.ok(zxs.nonnegint.nullable().safeParse(null).success));
            it("zero int", () => assert.ok(zxs.nonnegint.safeParse(0).success));
            it("zero non-int", () => assert.ok(zxs.nonnegint.safeParse(0.00).success));  // converts
        });
        describe("bad data", () => {
            it("non-number", () => assert.ok(!zxs.nonnegint.safeParse("str").success));
            it("null", () => assert.ok(!zxs.nonnegint.safeParse(null).success));
            it("negative", () => assert.ok(!zxs.nonnegint.safeParse(-3).success));
            it("non-int", () => assert.ok(!zxs.nonnegint.safeParse(Math.PI).success));
        });
    });
    describe("positive", () => {
        describe("good data", () => {
            it("simple", () => assert.ok(zxs.positive.safeParse(3).success));
            it("simple w/optional", () => 
              assert.ok(zxs.positive.optional().safeParse(3).success));
            it("simple w/nullable", () => assert.ok(zxs.positive.nullable().safeParse(3).success));
            it("undefined w/optional", () => 
              assert.ok(zxs.positive.optional().safeParse(undefined).success));
            it("null w/nullable", () => assert.ok(zxs.positive.nullable().safeParse(null).success));
            it("non-int", () => assert.ok(zxs.positive.safeParse(Math.PI).success));
        });
        describe("bad data", () => {
            it("non-number", () => assert.ok(!zxs.positive.safeParse("str").success));
            it("null", () => assert.ok(!zxs.positive.safeParse(null).success));
            it("negative", () => assert.ok(!zxs.positive.safeParse(-3).success));
            it("zero int", () => assert.ok(!zxs.positive.safeParse(0).success));
            it("zero non-int", () => assert.ok(!zxs.positive.safeParse(0.00).success));  // converts
        });
    });
    describe("nonneg", () => {
        describe("good data", () => {
            it("simple", () => assert.ok(zxs.nonneg.safeParse(3).success));
            it("simple w/optional", () => 
              assert.ok(zxs.nonneg.optional().safeParse(3).success));
            it("simple w/nullable", () => assert.ok(zxs.nonneg.nullable().safeParse(3).success));
            it("undefined w/optional", () => 
              assert.ok(zxs.nonneg.optional().safeParse(undefined).success));
            it("null w/nullable", () => assert.ok(zxs.nonneg.nullable().safeParse(null).success));
            it("non-int", () => assert.ok(zxs.nonneg.safeParse(Math.PI).success));
            it("zero int", () => assert.ok(zxs.nonneg.safeParse(0).success));
            it("zero non-int", () => assert.ok(zxs.nonneg.safeParse(0.00).success));  // converts
        });
        describe("bad data", () => {
            it("non-number", () => assert.ok(!zxs.nonneg.safeParse("str").success));
            it("null", () => assert.ok(!zxs.nonneg.safeParse(null).success));
            it("negative", () => assert.ok(!zxs.nonneg.safeParse(-3).success));
        });
    });
    describe("strictdatestr", () => {
        describe("good data", () => {
            it("simple", () => assert.ok(zxs.strictdatestr.safeParse("2021-12-30").success));
            it("simple w/optional", () => 
              assert.ok(zxs.strictdatestr.optional().safeParse("2021-12-30").success));
            it("simple w/nullable", () =>
              assert.ok(zxs.strictdatestr.nullable().safeParse("2021-12-30").success));
            it("undefined w/optional", () => 
              assert.ok(zxs.strictdatestr.optional().safeParse(undefined).success));
            it("null w/nullable", () =>
              assert.ok(zxs.strictdatestr.nullable().safeParse(null).success));
        });
        describe("bad data", () => {
            it("non-string", () => assert.ok(!zxs.strictdatestr.safeParse(3).success));
            it("null", () => assert.ok(!zxs.strictdatestr.safeParse(null).success));
            it("empty string", () => assert.ok(!zxs.strictdatestr.safeParse("").success));
            it("undate string", () => assert.ok(!zxs.strictdatestr.safeParse("bad").success));
            it("no leading month 0", () =>
              assert.ok(!zxs.strictdatestr.safeParse("2021-2-30").success));
            it("no leading day 0", () =>
              assert.ok(!zxs.strictdatestr.safeParse("2021-02-3").success));
            it("trailing char", () =>
              assert.ok(!zxs.strictdatestr.safeParse("2021-02-03Z").success));
        });
    });
    describe("datestr", () => {
        describe("good data", () => {
            it("simple", () => assert.ok(zxs.datestr.safeParse("2021-12-30").success));
            it("simple w/optional", () => 
              assert.ok(zxs.datestr.optional().safeParse("2021-12-30").success));
            it("simple w/nullable", () =>
              assert.ok(zxs.datestr.nullable().safeParse("2021-12-30").success));
            it("undefined w/optional", () => 
              assert.ok(zxs.datestr.optional().safeParse(undefined).success));
            it("null w/nullable", () =>
              assert.ok(zxs.datestr.nullable().safeParse(null).success));
            it("no leading month 0", () =>
              assert.ok(zxs.datestr.safeParse("2021-2-30").success));
            it("no leading day 0", () =>
              assert.ok(zxs.datestr.safeParse("2021-02-3").success));
        });
        describe("bad data", () => {
            it("non-string", () => assert.ok(!zxs.datestr.safeParse(3).success));
            it("null", () => assert.ok(!zxs.datestr.safeParse(null).success));
            it("empty string", () => assert.ok(!zxs.datestr.safeParse("").success));
            it("undate string", () => assert.ok(!zxs.datestr.safeParse("bad").success));
            it("trailing char", () =>
              assert.ok(!zxs.datestr.safeParse("2021-02-03Z").success));
            it("wrong delimiter", () =>
              assert.ok(!zxs.datestr.safeParse("2021/12/30").success));
        });
    });
    describe("slashydatestr", () => {
        describe("good data", () => {
            it("simple", () => assert.ok(zxs.slashydatestr.safeParse("2021/12/30").success));
            it("simple w/optional", () => 
              assert.ok(zxs.slashydatestr.optional().safeParse("2021/12/30").success));
            it("simple w/nullable", () =>
              assert.ok(zxs.slashydatestr.nullable().safeParse("2021/12/30").success));
            it("undefined w/optional", () => 
              assert.ok(zxs.slashydatestr.optional().safeParse(undefined).success));
            it("null w/nullable", () =>
              assert.ok(zxs.slashydatestr.nullable().safeParse(null).success));
            it("no leading month 0", () =>
              assert.ok(zxs.slashydatestr.safeParse("2021/2/30").success));
            it("no leading day 0", () =>
              assert.ok(zxs.slashydatestr.safeParse("2021/02/3").success));
        });
        describe("bad data", () => {
            it("non-string", () => assert.ok(!zxs.slashydatestr.safeParse(3).success));
            it("null", () => assert.ok(!zxs.slashydatestr.safeParse(null).success));
            it("empty string", () => assert.ok(!zxs.slashydatestr.safeParse("").success));
            it("undate string", () => assert.ok(!zxs.slashydatestr.safeParse("bad").success));
            it("trailing char", () =>
              assert.ok(!zxs.slashydatestr.safeParse("2021/02/03Z").success));
            it("wrong delimiter", () =>
              assert.ok(!zxs.slashydatestr.safeParse("2021-12-30").success));
        });
    });
    describe("plainobject", () => {
        describe("good data", () => {
            it("empty obj", () => assert.ok(zxs.plainobject.safeParse({}).success));
            it("simple obj", () => assert.ok(zxs.plainobject.safeParse({alpha: 1}).success));
            it("simple w/optional", () => 
              assert.ok(zxs.plainobject.optional().safeParse({}).success));
            it("simple w/nullable", () =>
              assert.ok(zxs.plainobject.nullable().safeParse({alpha: 2}).success));
            it("undefined w/optional", () => 
              assert.ok(zxs.plainobject.optional().safeParse(undefined).success));
            it("null w/nullable", () =>
              assert.ok(zxs.plainobject.nullable().safeParse(null).success));
        });
        describe("bad data", () => {
            it("non-string", () => assert.ok(!zxs.plainobject.safeParse(3).success));
            it("null", () => assert.ok(!zxs.plainobject.safeParse(null).success));
            it("undate string", () => assert.ok(!zxs.plainobject.safeParse("bad").success));
            it("integer", () => assert.ok(!zxs.plainobject.safeParse(3).success));
            //it("RegExp", () => assert.ok(!zxs.plainobject.safeParse(/re/).success));
            it("Date", () => assert.ok(!zxs.plainobject.safeParse(new Date()).success));
            it("Class", () => assert.ok(!zxs.plainobject.safeParse(Date).success));
            it("boolean", () => assert.ok(!zxs.plainobject.safeParse(true).success));
            it("array array", () => assert.ok(!zxs.plainobject.safeParse([]).success));
            it("populated array", () => assert.ok(!zxs.plainobject.safeParse([1, 2]).success));
        });
    });
    describe("isotimestr", () => {
        describe("bad data", () => {
            it("non-string", () => assert.ok(!zxs.isotimestr.safeParse(3).success));
            it("null", () => assert.ok(!zxs.isotimestr.safeParse(null).success));
            it("empty string", () => assert.ok(!zxs.isotimestr.safeParse("").success));
            it("invalid date components", () => {
                assert.ok(!zxs.isotimestr.safeParse("2021-22-13T23:24:25+04:00").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-43T23:24:25+04:00").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-2-13T23:24:25+04:00").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-3T23:24:25+04:00").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-22-13T23:24:25Z").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-43T23:24:25Z").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-2-13T23:24:25Z").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-3T23:24:25Z").success);
            });
            it("missing date chars", () => {
                assert.ok(!zxs.isotimestr.safeParse("21-12-13T23:24:25+04:00").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-2-13T23:24:25+04:00").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-3T23:24:25+04:00").success);
                assert.ok(!zxs.isotimestr.safeParse("21-12-13T23:24:25Z").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-2-13T23:24:25Z").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-3T23:24:25Z").success);
                assert.ok(!zxs.isotimestr.safeParse("21-12-13T23:24:25").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-2-13T23:24:25").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-3T23:24:25").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-13T23:24:2").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-13T23:24:2Z").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-13T23:2:25").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-13T23:2:25Z").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-13T2:24:25").success);
                assert.ok(!zxs.isotimestr.safeParse("2021-12-13T2:24:25Z").success);
            });
            it("no zone indicator", () =>
                assert.ok(!zxs.isotimestr.safeParse("2021-12-13T23:24:25").success));
        });
        describe("good data", () => {
            it("simple w/optional", () => 
              assert.ok(zxs.isotimestr.optional().safeParse("2021-12-13T23:24:25Z").success));
            it("simple w/nullable", () =>
              assert.ok(zxs.isotimestr.nullable().safeParse("2021-12-13T23:24:25Z").success));
            it("undefined w/optional", () => 
              assert.ok(zxs.isotimestr.optional().safeParse(undefined).success));
            it("null w/nullable", () =>
              assert.ok(zxs.isotimestr.nullable().safeParse(null).success));
            it("Z zone", () =>
                assert.ok(zxs.isotimestr.safeParse("2021-12-13T23:24:25Z").success));
            it("+/- zone offset", () => {
                assert.ok(zxs.isotimestr.safeParse("2021-12-13T23:24:25+04:00").success);
                assert.ok(zxs.isotimestr.safeParse("2021-12-13T23:24:25-04:00").success);
            });
        });
    });
    describe("isotimestr_s", () => {
        describe("bad data", () => {
            it("non-string", () => assert.ok(!zxs.isotimestr_s.safeParse(3).success));
            it("null", () => assert.ok(!zxs.isotimestr_s.safeParse(null).success));
            it("empty string", () => assert.ok(!zxs.isotimestr_s.safeParse("").success));
            it("invalid date components", () => {
                assert.ok(!zxs.isotimestr_s.safeParse("2021-22-13T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-43T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-2-13T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-3T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-3T23:24:2").success);
            });
            it("missing date chars", () => {
                assert.ok(!zxs.isotimestr_s.safeParse("21-12-13T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-2-13T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-3T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("21-12-13T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-2-13T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-3T23:24:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-13T23:24:2").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-13T23:2:25").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-13T2:24:25").success);
            });
            it("+/- zone offset", () => {
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-13T23:24:25+04:00").success);
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-13T23:24:25-04:00").success);
            });
            it("Z zone", () =>
                assert.ok(!zxs.isotimestr_s.safeParse("2021-12-13T23:24:25Z").success));
        });
        describe("good data", () => {
            it("simple w/optional", () => 
              assert.ok(zxs.isotimestr_s.optional().safeParse("2021-12-13T23:24:25").success));
            it("simple w/nullable", () =>
              assert.ok(zxs.isotimestr_s.nullable().safeParse("2021-12-13T23:24:25").success));
            it("undefined w/optional", () => 
              assert.ok(zxs.isotimestr_s.optional().safeParse(undefined).success));
            it("null w/nullable", () =>
              assert.ok(zxs.isotimestr_s.nullable().safeParse(null).success));
        });
    });
});
