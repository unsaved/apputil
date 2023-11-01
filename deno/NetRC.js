import AppErr from "./AppErr.js";
import { z } from "https://deno.land/x/zod/mod.ts";
import zxs from "./zod-extra-schemas.js";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

// JavaScript doesn't allow for class static constants, so:
const URL_RE = /^[^:]+:[/]+([\w.-]+)/;
const DEFAULT_STANZA_RE = /(?:^|\s)(default\s[\s\S]+?)$/;
const LOGIN_RE = /\slogin\s+(\S+)/;
const PASSWORD_RE = /\spassword\s+(\S+)/;

export default class NetRC {
    constructor() {
        z.array().length(0).parse(Array.prototype.slice.call(arguments));
        const homeDir = Deno.env.get("HOME");
        if (existsSync(`${homeDir}/.netrc`, { isReadable: true, isFile: true }))
            this.file = `${homeDir}/.netrc`;
        else if (existsSync(`${homeDir}/_netrc`, { isReadable: true, isFile: true }))
            this.file = `${homeDir}/_netrc`;
        if (this.file === undefined) throw new AppErr(
          "No regular, readable file '.netrc' or '_netrc' in your home directory");
    }
    getAuthSettings(urlString) {
        z.tuple([z.string()]).parse(zxs.argsTuplify(arguments, 1));
        let ex = URL_RE.exec(urlString);
        if (!ex) throw new AppErr(`URL malformatted: ${urlString}`);
        const hostname = ex[1];
        const rcContent = Deno.readTextFileSync(this.file).replace(/^\s*#.*$/gm, "");
        // eslint-disable-next-line prefer-template
        ex = new RegExp("(?:^|\\s)(machine\\s+" + hostname
          + "\\s[\\s\\S]*?)\\s(?:default\\s|machine\\s|$)").exec(rcContent);
        if (!ex) ex = DEFAULT_STANZA_RE.exec(rcContent);
        if (!ex) throw new AppErr(
        `No stanza for '${hostname}' or default found in '${this.file}' file`);
        const rcStanza = ex[1];
        ex = LOGIN_RE.exec(rcStanza);
        if (!ex) throw new AppErr(
            `No login setting for '${hostname}' stanza in '${this.file}' file`);
        const u = ex[1];
        ex = PASSWORD_RE.exec(rcStanza);
        if (!ex) throw new AppErr(
          `No password setting for '${hostname}' stanza in '${this.file}' file`);
        const p = ex[1];
        return { username: u, password: p };
    }
    toString() {
        return `RC File '${this.file}`;
    }
}
