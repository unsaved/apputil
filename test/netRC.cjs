"use strict";

const { NetRC } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");

describe("es5 apputils 'NetRc' class", () => {
    it("AppError available", () => {
        assert.doesNotThrow(() =>
            // Will fail if you have no ~/.netrc or ~/_netrc file!
            new NetRC()
        );
    });
});

