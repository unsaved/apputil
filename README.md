# Description
Application Development Utilities

An Error type and handlers for concise error handling for expected failure
cases.

A very powerful script runner, JsShell, that's more precise and direct for controlled
program executions than OS shells.

Since version 2.4.0 supports both CommonJS/ES5 requires and ES6 import...from.
Since version 4.1.0 supports deno.

Load some subset of these functions

* AppErr  An Error type for facilitating concise error reporting
* conciseCatcher  Function wrapper to succinctly report on expected errors
* isPlainObject
* JsShell  A powerful system for executing a batch of commands (command-line drivers jsShellDriver.* provided)
* mkConciseErrorHandler  Succinct error reporting for use in catch blocks and by conciseCatcher
* mkDate  Create Date objects for days with local midnight time, with optional convenient offsets
* NetRC  Load .netrc entries.
* offsetDate  Conveniently generate a new Date with specified offsets from the provided date
* plusify  Prefix number strings with a + prefix for positives (with Deno sprintf is more general).
* zxs  Several additional schemas for Zod

like so:
```javascript
const { AppErr, conciseCatcher, conciseErrorHandler } = require("@admc.com/apputil");
```
OR
```javascript
import { AppErr, conciseCatcher, conciseErrorHandler} from "@admc.com/apputil";
```
OR
```javascript
import { AppErr, conciseCatcher, conciseErrorHandler} from "https://deno.land/x/apputil/apputil-deno.mjs";
```
