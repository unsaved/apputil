import { isPlainObject } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';

describe("es6 apputils 'isPlainObject' function", () => {
    it("positives", () => {
        assert.ok(isPlainObject({}));
        assert.ok(isPlainObject({alpha: 1}));
    });
    it("non-objects", () => {
        assert.ok(!isPlainObject(undefined));
        assert.ok(!isPlainObject(null));
        assert.ok(!isPlainObject(3));
        assert.ok(!isPlainObject(/re/));
        assert.ok(!isPlainObject(new Date()));
        assert.ok(!isPlainObject(Date));
        assert.ok(!isPlainObject(true));
        assert.ok(!isPlainObject([]));
        assert.ok(!isPlainObject([1, 2]));
    });
});
