# Description
Application Development Utilities

An Error type and handlers for concise error handling for expected failure
cases.

A very powerful script runner, JsShell, that's more precise and direct for controlled
program executions than OS shells.

Since version 2.4.0 supports both CommonJS/ES5 requires and ES6 import...from.
Since version 4.1.0 supports deno.

Load some subset of these functions

* AppErr
* conciseCatcher
* isPlainObject
* JsShell
* mkConciseErrorHandler
* mkDate
* NetRC
* offsetDate
* plusify
* zxs

like so:
```javascript
const { AppErr, conciseCatcher, conciseErrorHandler } = require("@admc.com/apputil");
OR
import { AppErr, conciseCatcher, conciseErrorHandler} from "@admc.com/apputil";
OR
import { AppErr, conciseCatcher, conciseErrorHandler} from "https://deno.land/x/apputil/apputil-deno.mjs";
```
