"use strict";

const { JsShell } = require("../apputil-es5.cjs");
const assert = require("node:assert/strict");

describe("es5 apputils 'JsShell' class", () => {
    it("AppError available", () => {
        assert.doesNotThrow(() =>
            new JsShell("pseudofile", [{ "label": "whoami?", "cmd": ["whoami"] }],
                ".", undefined, undefined, process.env).run(true, false, true)
        );
    });
});

