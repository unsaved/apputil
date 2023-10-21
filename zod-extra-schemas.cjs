"use strict";

const z = require("zod");

// Short-cuts that collapse chained functions into a single schema:
module.exports.int = z.number().int();
module.exports.posint = z.number().int().positive();
module.exports.nonnegint = z.number().int().nonnegative();
module.exports.positive = z.number().positive();
module.exports.nonneg = z.number().nonnegative();
// Fixed because OOTB does not detect oversized components.
// These are accepted valid by Zod:  2023-13-42T25:73:74Z  2023-00-00T25:73:74Z
module.exports.isotimestr = z.string().datetime({offset: true}).refine(s => {
    const ex = /^\d+-(\d+)-(\d+)T(\d+):(\d+):(\d+)/.exec(s);
    if (!ex) return false;
    const ints = ex.slice(1).map(s => parseInt(s));
    return ints[0] > 0 && ints[0] < 13 && ints[1] > 0 && ints[1] < 32 &&
      ints[2] < 25 && ints[3] < 60 && ints[4] < 60;
});
// to second resolution with no optional zone suffix
// Can't leverage any Zod OOTB because they all ready some zone adjustment suffix
module.exports.isotimestr_s = z.string().refine(s => {
    const ex = /^\d{4}-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)$/.exec(s);
    if (!ex) return false;
    const ints = ex.slice(1).map(s => parseInt(s));
    return ints[0] > 0 && ints[0] < 13 && ints[1] > 0 && ints[1] < 32 &&
      ints[2] < 25 && ints[3] < 60 && ints[4] < 60;
});

// New operations not supported directly by Zod
module.exports.datestr =
  z.string().regex(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12]\d|3[01])$/);
module.exports.slashydatestr =
  z.string().regex(/^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12]\d|3[01])$/);
module.exports.strictdatestr =
  z.string().regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/);
// DOES NOT WORK for /re/s!:
module.exports.plainobject = z.object({}).refine(val =>
  Object.getPrototypeOf(val) === Object.getPrototypeOf({}));
