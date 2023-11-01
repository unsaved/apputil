import { NetRC } from "../apputil-deno.mjs";

Deno.test("apputils 'NetRc' class", async t => {
    await t.step("AppError available", async () =>
        // Will fail if you have no ~/.netrc or ~/_netrc file!
        new NetRC()
    );
});
