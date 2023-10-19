import { JsShell } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';

describe("apputils 'JsShell' class", () => {
    it("AppError available", () => {
        assert.doesNotThrow(() =>
            new JsShell("pseudofile", [{ "label": "whoami?", "cmd": ["whoami"] }],
                ".", undefined, undefined, process.env).run(true, false, true)
        );
    });
});

