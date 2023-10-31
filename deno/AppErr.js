import { sprintf } from "https://deno.land/std@0.204.0/fmt/printf.ts";

export default class AppErr extends Error {
    constructor() {
        super(sprintf.apply(null, arguments));
        this.name = "AppErr";
    }
}
