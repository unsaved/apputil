"use strict";

const { JsShell } = require("../index");
const assert = require("node:assert/strict");

describe("apputils 'mkDate' function", () => {
    it("AppError available", () => {
        assert.doesNotThrow(() =>
            new JsShell("pseudofile", [{ "label": "whoami?", "cmd": ["whoami"] }],
                ".", undefined, undefined, process.env).run(true, false, true)
        );
    });
});

