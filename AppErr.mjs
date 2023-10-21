import util from "util";

export default class AppErr extends Error {
    constructor() {
        super(util.format.apply(null, arguments));
        this.name = "AppErr";
    }
}
