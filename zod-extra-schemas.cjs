"use strict";

const z = require("zod");

// Short-cuts that collapse chained functions into a single schema:
module.exports.int = z.number().int();
module.exports.posint = z.number().int().positive();
module.exports.nonnegint = z.number().int().nonnegative();
module.exports.positive = z.number().positive();
module.exports.nonneg = z.number().nonnegative();
module.exports.isotimestr = z.string().datetime({offset: true});
// to second resolution with no optional zone suffix (other than Z)
module.exports.isotimestr_s = z.string().datetime({precision: 0});

// New operations not supported directly by Zod
module.exports.strictdatestr = z.string().regex(/^\d{4}-[01]\d-[0-3]\d$/);
module.exports.plainobject = z.object({}).refine(val =>
  Object.getPrototypeOf(val) === Object.getPrototypeOf({}));
