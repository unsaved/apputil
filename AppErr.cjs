"use strict";

module.exports = class AppErr extends Error {
    constructor() {
        super(require("util").format.apply(null, arguments));
        this.name = "AppErr";
    }
};
