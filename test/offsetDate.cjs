"use strict";

const { offsetDate } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");
const { ZodError } = require("zod");

describe("es5 apputils 'offsetDate' function", () => {
    it("non-date param", () => {
        assert.throws(() => { offsetDate(null); }, ZodError);
        assert.throws(() => { offsetDate(null, 1, 2, 3, 4); }, ZodError);
        assert.throws(() => { offsetDate(1); }, ZodError);
        assert.throws(() => { offsetDate("str"); }, ZodError);
        assert.throws(() => { offsetDate(1, 1, 2, 3); }, ZodError);
        assert.throws(() => { offsetDate(1, 1, 2, 3, 4); }, ZodError);
        assert.throws(() => { offsetDate("str", 1, 2, 3); }, ZodError);
        assert.throws(() => { offsetDate("str", 1, 2, 3, 4); }, ZodError);
    });
    it("non-integer param", () => {
        assert.throws(() => { offsetDate(); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), null); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1, null); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, null); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, 3, null); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), "str"); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1, "str"); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, "str"); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, 3, "str"); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1.2); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1, 1.2); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, 1.2); }, ZodError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, 3, 1.2); }, ZodError);
    });
    it("clone a Date", () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const cloneDate = offsetDate(newDate);
        assert.equal(cloneDate.getTime(), newDate.getTime());
    });
    it("positive offsets", () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const adjDate = offsetDate(newDate, 20, undefined, -40);
        assert.equal(adjDate.getTime(), newDate.getTime() + 20*60*60*1000 - 40*1000);
    });
    it("negative offsets", () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const adjDate = offsetDate(newDate, -20, -30, -40, -50);
        assert.equal(adjDate.getTime(),
          newDate.getTime() - 20*60*60*1000 - 30*60*1000 - 40*1000 - 50);
    });
    it("offset mix", () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const adjDate = offsetDate(newDate, 20, undefined, -40);
        assert.equal(adjDate.getTime(), newDate.getTime() + 20*60*60*1000 - 40*1000);
    });
});
