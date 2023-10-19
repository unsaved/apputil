import { JsShell } from "../apputil-es6.mjs";
import { strict as assert } from 'assert';

describe("es6 apputils 'JsShell' class", () => {
    it("AppError available", () => {
        assert.doesNotThrow(() =>
            new JsShell("pseudofile", [{ "label": "whoami?", "cmd": ["whoami"] }],
                ".", undefined, undefined, process.env).run(true, false, true)
        );
    });
});

