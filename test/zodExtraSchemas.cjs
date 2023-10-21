"use strict";

const zxs = require("../zod-extra-schemas.cjs");
const assert = require("node:assert/strict");

describe("es5 extra Zod schemas", () => {
    describe("posint", () => {
        describe("positive", () => {
            it("simple", () => assert.ok(zxs.posint.safeParse(3).success));
            it("simple w/optional", () => 
                assert.ok(zxs.posint.optional().safeParse(3).success));
            it("simple w/nullable", () => assert.ok(zxs.posint.nullable().safeParse(3).success));
            it("undefined w/optional", () => 
                assert.ok(zxs.posint.optional().safeParse(undefined).success));
            it("null w/nullable", () => assert.ok(zxs.posint.nullable().safeParse(null).success));
        });
        describe("negative", () => {
            it("non-number", () => assert.ok(!zxs.posint.safeParse("str").success));
            it("null", () => assert.ok(!zxs.posint.safeParse("str").success));
            it("negative", () => assert.ok(!zxs.posint.safeParse(-3).success));
            it("zero int", () => assert.ok(!zxs.posint.safeParse(0).success));
            it("zero non-int", () => assert.ok(!zxs.posint.safeParse(0.00).success));
            it("non-int", () => assert.ok(!zxs.posint.safeParse(Math.PI).success));
        });
    });
});
