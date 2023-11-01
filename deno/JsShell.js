import AppErr from "./AppErr.js";
import { z } from "https://deno.land/x/zod/mod.ts";
import zxs from "./zod-extra-schemas.js";
import { sprintf } from "https://deno.land/std@0.204.0/fmt/printf.ts";

const REF_RE = /[$]{([^}]+)}/g;

/**
 * Executes external programs, like an OS shell, without conveniences like
 * recall, aliases, background process control, terminal control,
 * env var manipulation.
 *
 * @param inheritEnv true means to add the provided env entries (if any) to the current
 *        process.env.  If unset or false then the new process will only have the variables
 *        explicitly added by you plus those which may be added by the OS.
 */
export default class JsShell {
    constructor(id, config, defaultCwd, env={}, inheritEnv=false, substMap) {
        z.tuple([z.string(), zxs.plainobject.array(),
          z.string().optional(), zxs.plainobject.optional(), z.boolean().optional(),
          // this was object instead of plainobject before ported from bycontract.  Mistake?
          z.object({}).optional()]).
          parse(zxs.argsTuplify(arguments, 6));
        this.id = id;
        for (const key in env)
            z.string({
                required_error: s => `Env var '${s}' value not set`,
                invalid_type_error: s => `Env var '${s}' value not a string ${env[key]}`,
            }).parse(env[key]);
        if (substMap !== undefined) for (const key in substMap)
            z.string({
                required_error: s => `substMap var '${s}' value not set`,
                invalid_type_error:
                  s => `substMap var '${s}' value not a string ${substMap[key]}`,
            }).parse(substMap[key]);
        config.forEach((rec, i) => {
            z.object({cmd: z.string().array()}).parse(rec);
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
        this.env = env;
        this.inheritEnv = inheritEnv;
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
     * To run quietly, nullify console.info, as is done with -q switch
     * of jsShellDriver.js.
     */
    run(dfltRequire0=false, dfltStdout=true, dfltStderr=true) {
        z.tuple([z.boolean().optional(), z.boolean().optional(), z.boolean().optional()]).
          parse(zxs.argsTuplify(arguments, 3));
        this.lastExecDuration = -1;
        const substMapRef = this.substMap;
        const startMs = new Date().valueOf();
        const configCount = this.config.length;
        const decoder = new TextDecoder();
        this.config.forEach((rec, i) => {
            let cmdStatus;
            const allArgs = this.substMap === undefined ? rec.cmd.slice() :
              rec.cmd.map(arg =>
                substMapRef === undefined ? arg : arg.replace(REF_RE, refReplacement)
              );
            const args = allArgs.slice();
            const cmd = args.shift();
            const stdOut = "stdout" in rec ? rec.stdout : dfltStdout;
            const stdErr = "stderr" in rec ? rec.stderr : dfltStderr;
            const cwd = "cwd" in rec ? rec.cwd : this.dfltCwd;
            const require0 = "require0" in rec ? rec.require0 : dfltRequire0;
            const opts = {
              args,
              stdin: rec.interactive ? "inherit" : "null",
              stdout: stdOut ? "inherit" : "piped",
              stderr: stdErr ? "inherit" : "piped",
              windowsRawArguments: true,  // ignored on UNIX
              //windowsHide: true,  // TODO: TEST THIS OUT for terminal and graphical programs
              env: this.env,
              clearEnv: !this.inheritEnv,
              //windowsHide: true,  // TODO: TEST THIS OUT for terminal and graphical programs
            };
            const condFn = "condition" in rec ?  // eslint-disable-next-line no-eval
                function() { return eval(rec.condition); } : undefined;
            if (cwd !== undefined) opts.cwd = cwd;
            // maxBuffer?

            const label = rec.label === undefined ? undefined :
              this.substMap === undefined ? rec.label :
              rec.label.replace(REF_RE, refReplacement);

            console.info(`[#${i+1}/${configCount} ${label ? label : allArgs}]`);
            console.debug("with options", opts);
            if (condFn !== undefined) {
                let condReturn;
                try {
                    condReturn = condFn();
                } catch (ie) {
                    throw new AppErr(`condition execution threw ${ie.message}`);
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
            try {
                // Empiricall this returns a emrge of Deno.CommandStatus + Deno.CommandOutput
                // even though the Deno docs says that it returns a Deno.CommandOutput.
                cmdStatus = new Deno.Command(cmd, opts).outputSync();
            } catch (cmdE) {
                if (label)
                    throw new AppErr("Command #%i/%i '%s' failed.\n%s\n%s",
                      i+1, configCount, label, allArgs, String(cmdE));
                throw new AppErr("Command #%i/%i [%s] failed.\n%s",
                  i+1, configCount, String(allArgs), String(cmdE));
            }
            if (cmdStatus.signal !== null) {
                if (label)
                    throw new AppErr("Command #%i/%i '%s' terminated by signal %s\n%s",
                      i+1, configCount, label, cmdStatus.signal, allArgs);
                throw new AppErr("Command #%i/%i [%s] terminated by signal %s",
                  i+1, configCount, String(allArgs), cmdStatus.signal);
            }
            if (require0 && !cmdStatus.success) {
          /* eslint-disable no-multi-spaces, no-extra-parens, keyword-spacing, prefer-template */
                if (label)
                    throw new AppErr(
                      sprintf("Command #%i/%i '%s' exited with value %i\n%s",
                      i+1, configCount, label, cmdStatus.code, String(allArgs))
                      + (stdOut ? "" : ( "\nSTDOUT: ####################################\n"
                      +  decoder.decode(cmdStatus.stdout)))
                      + (stdErr ? "" : ( "\nSTDERR: ####################################\n"
                      +  decoder.decode(cmdStatus.stderr)))
                    );
                throw new AppErr(
                  sprintf("Command #%i/%i [%s] exited with value %i",
                  i+1, configCount, String(allArgs), cmdStatus.code)
                  + (stdOut ? "" : ( "\nSTDOUT: ####################################\n"
                  +  decoder.decode(cmdStatus.stdout)))
                  + (stdErr ? "" : ( "\nSTDERR: ####################################\n"
                  +  decoder.decode(cmdStatus.stderr)))
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
}
