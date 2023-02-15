"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = void 0;
var getSecret = function () {
    var secret = process.env.SECRET;
    if (secret)
        return secret;
    throw new Error("Missing SECRET .env variable");
};
exports.getSecret = getSecret;
