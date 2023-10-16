const { mkDate } = require("../index");
const assert = require("node:assert/strict");

describe("apputils 'mkDate' function", () => {
    it("param not a string", () => {
        assert.throws(() => { mkDate(null); }, TypeError);
        assert.throws(() => { mkDate(null); }, TypeError);
    });
    it("param not a date", () => {
        assert.throws(() => { mkDate("bad"); }, TypeError);
    });
    it("param not a strictdate", () => {
        assert.throws(() => { mkDate("20-12-13"); }, TypeError);
        assert.throws(() => { mkDate("2022-21-22"); }, TypeError);
        assert.throws(() => { mkDate("2022-12-2"); }, TypeError);
    });
    it("generate a Date", () => {
        assert.ok(mkDate("2023-04-05") instanceof Date);
    });
});
