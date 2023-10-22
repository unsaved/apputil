import { mkDate } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';
import { ZodError } from "zod";

describe("es6 apputils 'mkDate' function", () => {
    it("param not a string", () => {
        assert.throws(() => { mkDate(null); }, ZodError);
        assert.throws(() => { mkDate(123); }, ZodError);
    });
    it("generate a default Date", () => {
        const newDate = mkDate("2023-04-05T01:02:03.345Z");
        assert.ok(newDate instanceof Date);
        assert.equal(1, newDate.getUTCHours());
        assert.equal(2, newDate.getUTCMinutes());
        assert.equal(3, newDate.getUTCSeconds());
        assert.equal(345, newDate.getUTCMilliseconds());
    });
    it("generate a default Date with offset", () => {
        const newDate = mkDate("2023-04-05T01:02:03.345Z", 0, 0, 2, -4);
        assert.ok(newDate instanceof Date);
        assert.equal(1, newDate.getUTCHours());
        assert.equal(2, newDate.getUTCMinutes());
        assert.equal(5, newDate.getUTCSeconds());
        assert.equal(341, newDate.getUTCMilliseconds());
    });
    it("generate a time-zeroed Date", () => {
        const newDate = mkDate("2023-04-05");
        assert.ok(newDate instanceof Date);
        assert.equal(0, newDate.getHours());
        assert.equal(0, newDate.getMinutes());
        assert.equal(0, newDate.getSeconds());
        assert.equal(0, newDate.getMilliseconds());
    });
    it("generate a time-zeroed Date with offset", () => {
        const newDate = mkDate("2023-04-05", 2, 3, 4, 5);
        assert.ok(newDate instanceof Date);
        assert.equal(2, newDate.getHours());
        assert.equal(3, newDate.getMinutes());
        assert.equal(4, newDate.getSeconds());
        assert.equal(5, newDate.getMilliseconds());
    });
    it("generate a default Date with negative offsets", () => {
        const baseDate = new Date("2023-04-05T01:02:03.345Z");
        assert.ok(baseDate instanceof Date);
        const newDate = mkDate("2023-04-05T01:02:03.345Z", -2, -3, -4, -5);
        assert.ok(newDate instanceof Date);
        assert.equal(baseDate.getTime() - 2 * 60*60*1000 - 3 * 60*1000 - 4 * 1000 -5,
          newDate.getTime());
    });
});
