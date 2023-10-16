const { mkDate } = require("../index");
const assert = require("node:assert/strict");

describe("apputils 'mkDate' function", () => {
    it("param not a string", () => {
        assert.throws(() => { mkDate(null); }, TypeError);
        assert.throws(() => { mkDate(123); }, TypeError);
    });
    it("generate a default Date", () => {
        const newDate = mkDate("2023-04-05T01:02:03.345Z");
        assert.ok(newDate instanceof Date);
        assert.equal(1, newDate.getUTCHours());
        assert.equal(2, newDate.getUTCMinutes());
        assert.equal(3, newDate.getUTCSeconds());
        assert.equal(345, newDate.getUTCMilliseconds());
    });
    it("generate a time-zeroed Date", () => {
        const newDate = mkDate("2023-04-05");
        assert.ok(newDate instanceof Date);
        assert.equal(0, newDate.getHours());
        assert.equal(0, newDate.getMinutes());
        assert.equal(0, newDate.getSeconds());
        assert.equal(0, newDate.getMilliseconds());
    });
});
