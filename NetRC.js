"use strict";

const fs = require("fs");
const AppErr = require("./AppErr");
const { validate } = require("@admc.com/bycontract-plus");

// JavaScript doesn't allow for class static constants, so:
const URL_RE = /^[^:]+:[/]+([\w.-]+)/;
const DEFAULT_STANZA_RE = /(?:^|\s)(default\s[\s\S]+?)$/;
const LOGIN_RE = /\slogin\s+(\S+)/;
const PASSWORD_RE = /\spassword\s+(\S+)/;

module.exports = class NetRC {
    constructor() {
        validate(arguments, []);
        const homeDir = require("os").homedir();
        if (fs.existsSync(`${homeDir}/.netrc`)
          && fs.statSync(`${homeDir}/.netrc`).isFile())
            this.file = `${homeDir}/.netrc`;
        else if (fs.existsSync(`${homeDir}/_netrc`)
          && fs.statSync(`${homeDir}/_netrc`).isFile())
            this.file = `${homeDir}/_netrc`;
        if (this.file === undefined)
            throw new AppErr(
          "No regular file '.netrc' or '_netrc' in your home directory");
        try {
            fs.accessSync(this.file, fs.constants.R_OK);
        } catch(nestedE) {
            throw new AppErr("Can't read netrc file:", this.file);
        }
    }
    getAuthSettings(urlString) {
        validate(arguments, ["string"]);
        let ex = URL_RE.exec(urlString);
        if (!ex) throw new AppErr("URL malformatted:", urlString);
        const hostname = ex[1];
        const rcContent = fs.readFileSync(this.file, "utf8").
          replace(/^\s*#.*$/gm, "");
        ex = new RegExp("(?:^|\\s)(machine\\s+" + hostname
          + "\\s[\\s\\S]*?)\\s(?:default|machine)\\s").
          exec(rcContent);
        if (!ex) ex = DEFAULT_STANZA_RE.exec(rcContent);
        if (!ex) throw new AppErr(
        `No stanza for '${hostname}' or default found in '${this.file}' file`);
        const rcStanza = ex[1];
        ex = LOGIN_RE.exec(rcStanza);
        if (!ex) throw new AppErr(
            `No login setting for '${hostname}' stanza in '${this.file}' file`);
        const u = ex[1];
        ex = PASSWORD_RE.exec(rcStanza);
        if (!ex) throw new AppErr("No password setting "
          + `for '${hostname}' stanza in '${this.file}' file`);
        const p = ex[1];
        return { username: u, password: p };
    }
    toString() {
        return `RC File '${this.file}`;
    }
};
