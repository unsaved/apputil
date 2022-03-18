"use strict";

const { validate } = require("bycontract-plus");
const c_p = require("child_process");
const AppErr = require("./AppErr");
const util = require("util");

/**
 * Executes external programs, like an OS shell, without conveniences like
 * recall, aliases, background process control, terminal control,
 * env var manipulation.
 *
 * @param envAdd true means to add the procided env entires to the current
 *        process.env.  If you provide env with anvAdd unset or false,
 *        then the provided map will completely replace the current env.
 */
module.exports = class JsShell {
    constructor(id, config, defaultCwd, env, envAdd) {
        validate(arguments,
          ["string", "plainobject[]", "string=", "plainobject=", "boolean="]);
        this.id = id;
        if (envAdd !== undefined && env === undefined)
            throw new AppErr(
              "Config record specifies 'envAdd' but gives no 'env' map");
        if (env !== undefined) for (let key in env)
            validate(env[key], "string",
              `Env var '${key}' value not a string ${env[key]}`);
        config.forEach((rec,i) => {
            validate(rec, {cmd: "string[]"}, `Config record #${i+1}`);
            if (("stdout" in rec) && typeof(rec.stdout) !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'stdout' value: ${rec.stdout}`);
            if (("stderr" in rec) && typeof(rec.stderr) !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'stderr' value: ${rec.stderr}`);
            if (("require0" in rec) && typeof(rec.require0) !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'require0' value: ${rec.require0}`);
            if (("interactive" in rec) && typeof(rec.interactive) !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'interactive' value: ${rec.interactive}`);
            if (("cwd" in rec) && typeof(rec.cwd) !== "string")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-string 'cwd' value: ${rec.cwd}`);
            if (("stdout" in rec) && typeof(rec.stdout) !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'stdout' value: ${rec.stdout}`);
        });
        this.config = config;
        this.env = envAdd ? {...process.env, ...env} : env;
        this.dfltCwd = defaultCwd;
    }

    /**
     * Execute the commands synchronously.
     *
     * Standard error and standard output are always displayed in case
     * of failures (non-0 exit values judged errors based on your
     * configs, but many other failure causes don't even get to the
     * exit value stage).
     *
     * I recommend that callers nullify console.debug unless debugging.
     * To run quietly, nullify console.info, as is done with -q swith
     * of jsShellDriver.js.
     */
    run(dfltRequire0=false, dfltStdout=true, dfltStderr=true) {
        validate(arguments, ["boolean=", "boolean=", "boolean="]);
        this.lastExecDuration = -1;
        const startMs = new Date().valueOf();
        const configCount = this.config.length;
        this.config.forEach((rec, i) => {
            const stdOut = ("stdout" in rec) ? rec.stdout : dfltStdout;
            const stdErr = ("stderr" in rec) ? rec.stderr : dfltStderr;
            const cwd = ("cwd" in rec) ? rec.cwd : this.dfltCwd;
            const require0 = ("require0" in rec) ? rec.require0 : dfltRequire0;
console.warn("Opts", {
stdio: [
(rec.interactive ? "inherit" : "ignore"),
stdOut ? "inherit" : "pipe",
stdErr ? "inherit" : "pipe",
],});
            const opts = {
              stdio: [
                (rec.interactive ? "inherit" : "ignore"),
                stdOut ? "inherit" : "pipe",
                stdErr ? "inherit" : "pipe",
              ],
              windowsVerbatimArguments: true,  // ignored on UNIX
              //windowsHide: true,  // TODO: TEST THIS OUT for terminal and graphical programs
            };
            if (cwd !== undefined) opts.cwd = cwd;
            if (this.env !== undefined) opts.env = this.env;
            // maxBuffer?
            
            const args = rec.cmd.slice();
            const cmd = args.shift();

            console.info(`[#${i+1}/${configCount} ${rec.cmd}]`);
            console.debug(util.formatWithOptions({colors: true, depth: 0},
              "[with options %O]", opts));
            const pObj = c_p.spawnSync(cmd, args, opts); 
            if ("error" in pObj)
                throw new AppErr("Command #%i/%i [%s] failed.\n%O",
                  i+1, configCount, rec.cmd, pObj.error);
            if (pObj.signal !== null)
                throw new AppErr(
                  "Command #%i/%i [%s] terminated by signal %s\n%O",
                  i+1, configCount, rec.cmd, pObj.signal);
            if (require0 && pObj.status !== 0)
                throw new AppErr(
                  util.format("Command #%i/%i [%s] exited with value %i",
                  i+1, configCount, rec.cmd, pObj.status)
                  + (stdOut ? "" : (
                    "\nSTDOUT: ####################################\n"
                  +  pObj.stdout.toString("utf8")))
                  + (stdErr ? "" : (
                    "\nSTDERR: ####################################\n"
                  +  pObj.stderr.toString("utf8")))
                );
        });
        this.lastExecDuration = new Date().valueOf() - startMs;
        return this;
    }
};
