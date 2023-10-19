"use strict";

const { NetRC } = require("../apputil.cjs");
const assert = require("node:assert/strict");

describe("apputils 'mkDate' function", () => {
    it("AppError available", () => {
        assert.doesNotThrow(() =>
            // Will fail if you have no ~/.netrc or ~/_netrc file!
            new NetRC()
        );
    });
});

