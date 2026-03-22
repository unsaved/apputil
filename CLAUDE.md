# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Commands

```bash
npm test                  # Run all mocha tests
npm run lint              # Lint files in current dir
npm run lint-all          # Lint all *.mjs, *.cjs, test/, deno/, denotest/ files
npm run lintHtml          # Lint to local/eslint.html
npm run unixJsShell       # Run JsShell manually with testdata/cmdUnix.json
```

Run a single test file: `npx mocha test/jsShell.js`

## Architecture

This is a dual-format (ESM + CJS) Node.js utility library published as `@admc.com/apputil`, with a
parallel Deno port.

**Entry points:**
- `apputil-es6.mjs` — ESM entry, re-exports everything; the `"main"` for `type: "module"` packages
- `apputil-es5.cjs` — CommonJS entry, mirrors the ESM exports via `require()`
- `apputil-deno.mjs` — Deno-compatible entry (imports from `deno/` subdirectory)

**Source modules** (each paired `.mjs` + `.cjs` + `deno/*.js`):
- `AppErr.mjs` — Custom `Error` subclass; use instead of raw `Error` for expected/user-facing
  failures
- `appErrHandlers.mjs` — `conciseCatcher(fn, exitValue)` wraps async/sync functions;
  `mkConciseErrorHandler(exitValue)` returns a catch-block handler. Both distinguish `AppErr`
  (concise message only), `ZodError` (filtered stack), and unknown errors (full stack or rethrow).
  `exitValue`: `undefined`=rethrow, `null`=continue, positive int=`process.exit(n)`
- `JsShell.mjs` — Batch command runner; takes a JSON config array of `{cmd, label, cwd, require0,
  stdout, stderr, condition, interactive}` records; `substMap` supports `${VAR}` substitution in
  cmd strings; CLI driver is `jsShellDriver.mjs`
- `NetRC.mjs` — Parses `~/.netrc`
- `zod-extra-schemas.mjs` — Extra Zod schemas (`zxs`): `int`, `posint`, `plainobject`, etc., plus
  `argsTuplify()` helper for validating variadic arguments

**Tests** (`test/`): Mocha tests in both `.js` (ESM) and `.cjs` (CommonJS) variants for each
module. No mocharc — default spec glob applies.

**Deno** (`deno/`): Hand-maintained JS copies of the source modules adapted for Deno APIs. The
`denotest/` directory contains Deno test equivalents.

**String utilities** referenced in code (from a sibling package `@admc.com/apputil` v2.5.0, which
this package depends on):
- `dedent` — strips common leading indentation from multiline template literals
- `trimAndJoin` — trims each line and joins without newlines (for long string constants)

For all of the Coding Standards I give, use the rules not only when you are providing complete
scripts, but for all instructions and examples in your conversational messages.

## Language-independent Coding Conventions
- **Line Limit**: Adhere to a 100-character line limit for all files.
- **Indentation** (No tabs):
  - 4 spaces for programming, scripting, and shell languages.
  - 2 spaces for HTML, data formats like JSON, XML, and programming/scripting line continuations.
- **Shebang**: All directly invokable scripts must include a shebang using `/usr/bin/env` (e.g.,
  `#!/usr/bin/env node` or `#!/usr/bin/env bash`) to support PATH-based runtime and multiple
  interpreter switches.
- **Flow Control**: Minimize nesting levels. Perform error/special-state checking early and
  exit/return/continue/break immediately. Keep the "happy path" as the main, un-nested code flow.
  Handle and continue only if good (e.g., `handle_error || continue`), avoiding `if/else` where
  possible.
- **Naming**: Use descriptive, multi-word variable names that convey meaning without being overly
  verbose.
- **Trailing whitespace**: No useless (per-line) trailing whitespace

## JavaScript Code Standards
- **Syntax**: Use modern ES6+ (Arrow functions, `for...of` statements, destructuring, `const`/`let`).
- **Arrow Functions**: Use syntax shortcuts for brevity: omit parentheses for single parameters and
  omit braces/return for single-expression bodies.
- **Strings**: Use backtick template literals with `${}` interpolation instead of explicit string
  concatenation.
- **Strings**: To facilitate usage of multiline backtick strings without needing the string constant
  lines to make a mess by not being indented with the adjoining code, use function `@lib/dedent.js`.
- **Strings**: When you need a string constant without line breaks that's longer than 100 line
  length max allows, use a multiline backtick string and function `@lib/trimAndJoin` will trim each
  component line and join them without linebreaks.
- **Modules**: Prefer **ES Module** style (`import`/`export`). Use **CommonJS** (`require`) only
  when a third-party module does not support ESM.
- **Async**: Use `async/await` over raw Promises where possible.
- **Linting**: Honor `.eslintrc.json`, but prioritize code quality. Use inline comment directives
  to bypass rules where absolute conformity would make the code worse.
- **Formatting**: When breaking long chains, place line breaks AFTER the member-delimiting dots.
- **Brevity**: Use single-line conditionals with short bodies for brevity
  (e.g., `if (!res.ok) throw new Error("Fail");`). Avoid single-line code blocks unless part of a
  consistent series (omit the `{}` for single-line statements).
- **Logging**: Avoid `console.log`. Use specific logging **functions** to manage severity levels
  (e.g., `console.info`, `console.warn`, `console.error`).
- **Logic**: Avoid the idiosyncratic `booleanExpression && someFunction()` shortcut; use explicit
  conditionals.

## Bourne-style Shell Code Standards
- **Initialization**: Always start scripts with `set +u`, `set -o pipefail`, and
  `shopt -s xpg_echo`.
- **Dependency Checks**: Include a test block early for non-universally accessible executables:
```bash
for bin in x y z; do
    type -t $bin >/dev/null || Abort "$PROGNAME requires '$bin' in your search path"
done
```
- **Quoting**: Use single quotes for strings by default. Use double quotes only for interpolation
  (variables/expressions) or when the string contains a single quote.
- **Variables**: Use double quotes for variable references (e.g., `"$VARNAME"`) if they could be
  unset or contain whitespace, unless multiple-token expansion is explicitly required.
- **Logic**: Use the most succinct form for the context. Prefer
  `conditional && success_command` or `conditional && { ... }`. Use `&&` / `||` chains for
  `if/else` logic where precedence allows.
- **Brevity**: Place simple compounds on a single line if under 100 chars
  (e.g., `VAL=$(cmd) || Abort 'failed'`).
- **Conditionals**: Use either `[ ]` or `[[ ]]` based on which is supported by the shell and
  provides the cleanest syntax for the specific check.
- **Command stdin Blocks**: When the shell supports it, you don't need EOF prefix-stripping feature,
  and the stdin text block to be fed to a command doesn't itself contain the <<< quote character,
  use `<<<` per the following example, using `"` when you want variable and expression
  interpolations and `'` otherwise:
```bash
command <<< 'A
code block containing no single-quote
where you do not want interpolation.'
```
