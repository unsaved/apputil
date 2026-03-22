# Description
Application Development Utilities

An Error type and a powerful handler factory for type-aware throwable handling.

A very powerful script runner, JsShell, that's more precise and direct for controlled
program executions than OS shells.

Since version 2.4.0 supports both CommonJS/ES5 requires and ES6 import...from.
Since version 4.1.0 supports deno.
Since version 5.0.0 replaces conciseCatcher/mkConciseErrorHandler with mkAppThrowableHandler.

Load some subset of these exports

* AppErr  An Error type for facilitating concise error reporting
* isPlainObject
* JsShell  A powerful system for executing a batch of commands (command-line drivers jsShellDriver.* provided)
* mkAppThrowableHandler  Factory returning a type-aware throwable handler with chainable .handle() registrations
* mkDate  Create Date objects for days with local midnight time, with optional convenient offsets
* NetRC  Load .netrc entries.
* offsetDate  Conveniently generate a new Date with specified offsets from the provided date
* plusify  Prefix number strings with a + prefix for positives (with Deno sprintf is more general).
* zxs  Several additional schemas for Zod

like so:
```javascript
const { AppErr, mkAppThrowableHandler } = require("@admc.com/apputil");
```
OR
```javascript
import { AppErr, mkAppThrowableHandler } from "@admc.com/apputil";
```
OR
```javascript
import { AppErr, mkAppThrowableHandler } from "https://deno.land/x/apputil/apputil-deno.mjs";
```
