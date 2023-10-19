"use strict";

const { validate } = require("@admc.com/bycontract-plus");
const childProcess = require("child_process");
const AppErr = require("./AppErr.cjs");
const util = require("util");

const REF_RE = /[$]{([^}]+)}/g;

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
    constructor(id, config, defaultCwd, env, envAdd, substMap) {
        validate(arguments, ["string", "plainobject[]", "string=",
          "plainobject=", "boolean=", "object="]);
        this.id = id;
        if (envAdd !== undefined && env === undefined)
            throw new AppErr("Config record specifies 'envAdd' but gives no 'env' map");
        if (env !== undefined) for (const key in env)
            validate(env[key], "string", `Env var '${key}' value not a string ${env[key]}`);
        if (substMap !== undefined) for (const key in substMap)
            validate(substMap[key], "string",
              `substMap var '${key}' value not a string ${substMap[key]}`);
        config.forEach((rec, i) => {
            validate(rec, {cmd: "string[]"}, `Config record #${i+1}`);
            if ("stdout" in rec && typeof rec.stdout !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'stdout' value: ${rec.stdout}`);
            if ("stderr" in rec && typeof rec.stderr !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'stderr' value: ${rec.stderr}`);
            if ("require0" in rec && typeof rec.require0 !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'require0' value: ${rec.require0}`);
            if ("interactive" in rec && typeof rec.interactive !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'interactive' value: ${rec.interactive}`);
            if ("condition" in rec && typeof rec.condition !== "string")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-string 'condition' value: ${rec.condition}`);
            if ("cwd" in rec && typeof rec.cwd !== "string")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-string 'cwd' value: ${rec.cwd}`);
            if ("stdout" in rec && typeof rec.stdout !== "boolean")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-boolean 'stdout' value: ${rec.stdout}`);
            if ("label" in rec && typeof rec.label !== "string")
                throw new AppErr(`Config record ${id} #${i+1} `
                  + `has non-string 'label' value: ${rec.label}`);
        });
        this.substMap = substMap;
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
        const substMapRef = this.substMap;
        const startMs = new Date().valueOf();
        const configCount = this.config.length;
        this.config.forEach((rec, i) => {
            const stdOut = "stdout" in rec ? rec.stdout : dfltStdout;
            const stdErr = "stderr" in rec ? rec.stderr : dfltStderr;
            const cwd = "cwd" in rec ? rec.cwd : this.dfltCwd;
            const require0 = "require0" in rec ? rec.require0 : dfltRequire0;
            const opts = {
              stdio: [
                rec.interactive ? "inherit" : "ignore",
                stdOut ? "inherit" : "pipe",
                stdErr ? "inherit" : "pipe",
              ],
              windowsVerbatimArguments: true,  // ignored on UNIX
              //windowsHide: true,  // TODO: TEST THIS OUT for terminal and graphical programs
            };
            const condFn = "condition" in rec ?  // eslint-disable-next-line no-eval
                function() { return eval(rec.condition); } : undefined;
            if (cwd !== undefined) opts.cwd = cwd;
            if (this.env !== undefined) opts.env = this.env;
            // maxBuffer?


            const allArgs = this.substMap === undefined ? rec.cmd.slice() :
              rec.cmd.map(arg =>
                substMapRef === undefined ? arg : arg.replace(REF_RE, refReplacement)
              );
            const args = allArgs.slice();
            const cmd = args.shift();
            const label = rec.label === undefined ? undefined :
              this.substMap === undefined ? rec.label :
              rec.label.replace(REF_RE, refReplacement);

            console.info(`[#${i+1}/${configCount} ${label ? label : allArgs}]`);
            console.debug(util.formatWithOptions({colors: true, depth: 0},
              "[with options %O]", opts));
            if (condFn !== undefined) {
                let condReturn;
                try {
                    condReturn = condFn();
                } catch (ie) {
                    throw new AppErr("condition execution threw", ie.message);
                }
                if (typeof condReturn !== "boolean")
                    throw new AppErr("condition expression returned a "
                      + "%s rather than a boolean: %s", typeof condReturn, rec.condition);
                if (!condReturn) {
                    console.info(`#${i+1}/${configCount} Skipping `
                      + `'${label ? label : allArgs}' due to condition`);
                    return;
                }
            }
            const pObj = childProcess.spawnSync(cmd, args, opts);
            if ("error" in pObj) {
                if (label)
                    throw new AppErr("Command #%i/%i '%s' failed.\n%s\n%O",
                      i+1, configCount, label, allArgs, pObj.error);
                throw new AppErr("Command #%i/%i [%s] failed.\n%O",
                  i+1, configCount, allArgs, pObj.error);
            }
            if (pObj.signal !== null) {
                if (label)
                    throw new AppErr("Command #%i/%i '%s' terminated by signal %s\n%s",
                      i+1, configCount, label, pObj.signal, allArgs);
                throw new AppErr("Command #%i/%i [%s] terminated by signal %s",
                  i+1, configCount, allArgs, pObj.signal);
            }
            if (require0 && pObj.status !== 0) {
          /* eslint-disable no-multi-spaces, no-extra-parens, keyword-spacing, prefer-template */
                if (label)
                    throw new AppErr(
                      util.format("Command #%i/%i '%s' exited with value %i\n%s",
                      i+1, configCount, label, pObj.status, allArgs)
                      + (stdOut ? "" : ( "\nSTDOUT: ####################################\n"
                      +  pObj.stdout.toString("utf8")))
                      + (stdErr ? "" : ( "\nSTDERR: ####################################\n"
                      +  pObj.stderr.toString("utf8")))
                    );
                throw new AppErr(
                  util.format("Command #%i/%i [%s] exited with value %i",
                  i+1, configCount, allArgs, pObj.status)
                  + (stdOut ? "" : ( "\nSTDOUT: ####################################\n"
                  +  pObj.stdout.toString("utf8")))
                  + (stdErr ? "" : ( "\nSTDERR: ####################################\n"
                  +  pObj.stderr.toString("utf8")))
                );
          /* eslint-enable no-multi-spaces, no-extra-parens, keyword-spacing, prefer-template */
            }
        });
        this.lastExecDuration = new Date().valueOf() - startMs;
        return this;

        function refReplacement (m, p1) {
            //console.log("substMapRef", substMapRef);
            if (!(p1 in substMapRef))
                throw new AppErr(`A cmd values has orphaned reference '${m}'`);
            return substMapRef[p1];
        }
    }
};
