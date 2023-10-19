import { validate } from "@admc.com/bycontract-plus";
import util from "util";

export default class AppErr extends Error {
    constructor() {
        validate(arguments, [], false);
        super(util.format.apply(null, arguments));
        this.name = "AppErr";
    }
}
