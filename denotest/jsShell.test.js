import { JsShell } from "../apputil-deno.mjs";

Deno.test("apputils 'JsShell' class", async t => {
    await t.step("JsShell available", async () =>
        new JsShell("pseudofile", [{ label: "whoami?", cmd: ["whoami"] }]).run(true, false, true)
    );
});
