"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonTerminalScreen = void 0;
const color_1 = require("../common/color");
// Output does not go to terminal, but colors are controlled with terminal env vars.
exports.nonTerminalScreen = {
    colors: color_1.noColors,
    isTTY: false,
    ttyWidth: 0,
    ttyHeight: 0,
    resolveFiles: "rootDir",
};
