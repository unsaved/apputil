import { NetRC } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';

describe("apputils 'NetRc' class", () => {
    it("AppError available", () => {
        assert.doesNotThrow(() =>
            // Will fail if you have no ~/.netrc or ~/_netrc file!
            new NetRC()
        );
    });
});

