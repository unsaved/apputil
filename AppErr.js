"use strict";

const { validate } = require("@admc.com/bycontract-plus");

module.exports = class AppErr extends Error {
    constructor() {
        validate(arguments, [], false);
        super(require("util").format.apply(null, arguments));
        this.name = "AppErr";
    }
};
