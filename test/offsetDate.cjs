"use strict";

const { offsetDate } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");

describe("apputils 'offsetDate' function", () => {
    it("non-date param", () => {
        assert.throws(() => { offsetDate(null); }, TypeError);
        assert.throws(() => { offsetDate(null, 1, 2, 3, 4); }, TypeError);
        assert.throws(() => { offsetDate(1); }, TypeError);
        assert.throws(() => { offsetDate("str"); }, TypeError);
        assert.throws(() => { offsetDate(1, 1, 2, 3); }, TypeError);
        assert.throws(() => { offsetDate(1, 1, 2, 3, 4); }, TypeError);
        assert.throws(() => { offsetDate("str", 1, 2, 3); }, TypeError);
        assert.throws(() => { offsetDate("str", 1, 2, 3, 4); }, TypeError);
    });
    it("non-integer param", () => {
        assert.throws(() => { offsetDate(); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), null); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1, null); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, null); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, 3, null); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), "str"); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1, "str"); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, "str"); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, 3, "str"); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1.2); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1, 1.2); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, 1.2); }, TypeError);
        assert.throws(() => { offsetDate(new Date(), 1, 2, 3, 1.2); }, TypeError);
    });
    it("clone a Date", () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const cloneDate = offsetDate(newDate);
        assert.equal(newDate.getTime(), cloneDate.getTime());
    });
    it("positive offsets", () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const adjDate = offsetDate(newDate, 20, undefined, -40);
        assert.equal(newDate.getTime() + 20*60*60*1000 - 40*1000, adjDate.getTime());
    });
    it("negative offsets", () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const adjDate = offsetDate(newDate, -20, -30, -40, -50);
        assert.equal(newDate.getTime() - 20*60*60*1000 - 30*60*1000 - 40*1000 - 50,
          adjDate.getTime());
    });
    it("offset mix", () => {
        const newDate = new Date("2023-04-05T01:02:03.345Z");
        const adjDate = offsetDate(newDate, 20, undefined, -40);
        assert.equal(newDate.getTime() + 20*60*60*1000 - 40*1000, adjDate.getTime());
    });
});
