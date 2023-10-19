#!/usr/bin/env node

import fs from "fs";
import yargs from "yargs";
import { conciseCatcher, JsShell, getAppVersion } from "./apputil-es6.mjs";
import { validate } from "@admc.com/bycontract-plus";

const yargsDict = yargs(process.argv.slice(2)).
  strictOptions().
  usage(`SYNTAX: $0 [-dEhOqvz] [-m name=val] [-f folder] -- cmds.json...
Command files are JSON of lists of objects with these elements:
    label:       string      OPTIONAL
    cmd:         [An argv list]  REQUIRED
    cwd:         directory       OPTIONAL
    require0:    boolean     OPTIONAL  (require 0 exit values)
    stdOut:      boolean     OPTIONAL  (display stdout)
    stdErr:      boolean     OPTIONAL  (display stderr)
    condition:   string      OPTIONAL  (JS code that evaluates to true or false)
    interactive: boolean     OPTIONAL  (allow interactive input)`.
      replace(/ /g, "\u2009")).
  option("v", { describe: "Verbose", type: "boolean", }).
  option("d", { describe: "Debug logging", type: "boolean", }).
  option("q", {
      describe: "Quiet logging by logging only at level WARN and ERROR",
      type: "boolean",
  }).
  option("E", {
      describe: "hide standard Error from commands (default true)",
      type: "boolean",
  }).
  option("f", {
      describe: "default current working Folder for executions",
      type: "string",
      requiresArg: true,
  }).
  option("m", {
      describe: "specify one var to add to env var Map.  (Only one supported).",
      type: "string",
      requiresArg: true,
  }).
  option("O", {
      describe: "hide standard Output from commands (default true)",
      type: "boolean",
  }).
  option("z", {
      describe: "require 0 exit values (by default allows non-0s)",
      type: "boolean",
  }).
  alias("help", "h").
  demandCommand(1).
  version().argv;
const progName = yargsDict.$0.replace(/^.*[\\/]/, "");  // eslint-disable-line no-unused-vars
console.warn("progName", progName);

if (!yargsDict.d) console.debug = () => {};
if (yargsDict.q) console.debug = console.log = console.info = () => {};

let eMap;
if ("m" in yargsDict) {
    const ex = /^(\w+)=(.+)$/.exec(yargsDict.m);
    if (!ex) {
        console.error("-m value must be of format NAME=VALUE.  Maybe you need quotes.");
        yargs.showHelp();
        process.exit(9);
    }
    eMap[ex[1]] = ex[2];
}

conciseCatcher(function(cmdFiles, cwd, r0, out, err, envMap) {
    validate(arguments, ["string[]",
      "string=", "boolean=", "boolean=", "boolean=", "plainobject="]);
    const jsShells = cmdFiles.map(cmdFile =>
        new JsShell(cmdFile, JSON.parse(fs.readFileSync(cmdFile, "utf8")),
          cwd, envMap, envMap === undefined ? undefined : true, process.env)
    );
    console.debug(`${jsShells.length} command files validated successfully`);
    jsShells.forEach(jsShell => {
        console.info("%s took %s s.", jsShell.id,
            (jsShell.run(r0, out, err).lastExecDuration/1000).toFixed(3));
    });
})(yargsDict._, yargsDict.f, yargsDict.z, !yargsDict.O, !yargsDict.E, eMap);
