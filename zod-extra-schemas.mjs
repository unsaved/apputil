import z from "zod";

const thingsToExport = {};
// First a utility function to make functon 'arguments' compatible with Zod tuple tests
thingsToExport.argsTuplify = (args, maxLen) => {
    const argsArray = Array.prototype.slice.call(args);
    const origALen = argsArray.length;
    if (origALen >= maxLen) return argsArray;
    argsArray.length = maxLen;
    argsArray.fill(undefined, origALen);
    return argsArray;
};

// Short-cuts that collapse chained functions into a single schema:
thingsToExport.int = z.number().int();
thingsToExport.posint = z.number().int().positive();
thingsToExport.nonnegint = z.number().int().nonnegative();
thingsToExport.positive = z.number().positive();
thingsToExport.nonneg = z.number().nonnegative();
// Fixed because OOTB does not detect oversized components.
// These are accepted valid by Zod:  2023-13-42T25:73:74Z  2023-00-00T25:73:74Z
thingsToExport.isotimestr = z.string().datetime({offset: true}).refine(s => {
    const ex = /^\d+-(\d+)-(\d+)T(\d+):(\d+):(\d+)/.exec(s);
    if (!ex) return false;
    const ints = ex.slice(1).map(s => parseInt(s));
    return ints[0] > 0 && ints[0] < 13 && ints[1] > 0 && ints[1] < 32 &&
      ints[2] < 25 && ints[3] < 60 && ints[4] < 60;
});
// to second resolution with no optional zone suffix
// Can't leverage any Zod OOTB because they all ready some zone adjustment suffix
thingsToExport.isotimestr_s = z.string().refine(s => {
    const ex = /^\d{4}-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)$/.exec(s);
    if (!ex) return false;
    const ints = ex.slice(1).map(s => parseInt(s));
    return ints[0] > 0 && ints[0] < 13 && ints[1] > 0 && ints[1] < 32 &&
      ints[2] < 25 && ints[3] < 60 && ints[4] < 60;
});

// New operations not supported directly by Zod
thingsToExport.datestr =
  z.string().regex(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12]\d|3[01])$/);
thingsToExport.slashydatestr =
  z.string().regex(/^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12]\d|3[01])$/);
thingsToExport.strictdatestr =
  z.string().regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/);
// DOES NOT WORK for /re/s!:
thingsToExport.plainobject = z.object({}).refine(val =>
  Object.getPrototypeOf(val) === Object.getPrototypeOf({}));

export default thingsToExport;
