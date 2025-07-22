"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminalScreen = void 0;
const color_1 = require("../common/color");
const json_reporter_1 = require("../const/json-reporter");
exports.terminalScreen = (() => {
    let isTTY = !!process.stdout.isTTY;
    let ttyWidth = process.stdout.columns || 0;
    let ttyHeight = process.stdout.rows || 0;
    if (process.env.PLAYWRIGHT_FORCE_TTY === "false" ||
        process.env.PLAYWRIGHT_FORCE_TTY === "0") {
        isTTY = false;
        ttyWidth = 0;
        ttyHeight = 0;
    }
    else if (process.env.PLAYWRIGHT_FORCE_TTY === "true" ||
        process.env.PLAYWRIGHT_FORCE_TTY === "1") {
        isTTY = true;
        ttyWidth = process.stdout.columns || json_reporter_1.DEFAULT_TTY_WIDTH;
        ttyHeight = process.stdout.rows || json_reporter_1.DEFAULT_TTY_HEIGHT;
    }
    else if (process.env.PLAYWRIGHT_FORCE_TTY) {
        isTTY = true;
        const sizeMatch = process.env.PLAYWRIGHT_FORCE_TTY.match(/^(\d+)x(\d+)$/);
        if (sizeMatch) {
            ttyWidth = +sizeMatch[1];
            ttyHeight = +sizeMatch[2];
        }
        else {
            ttyWidth = +process.env.PLAYWRIGHT_FORCE_TTY;
            ttyHeight = json_reporter_1.DEFAULT_TTY_HEIGHT;
        }
        if (isNaN(ttyWidth))
            ttyWidth = json_reporter_1.DEFAULT_TTY_WIDTH;
        if (isNaN(ttyHeight))
            ttyHeight = json_reporter_1.DEFAULT_TTY_HEIGHT;
    }
    let useColors = isTTY;
    if (process.env.DEBUG_COLORS === "0" ||
        process.env.DEBUG_COLORS === "false" ||
        process.env.FORCE_COLOR === "0" ||
        process.env.FORCE_COLOR === "false")
        useColors = false;
    else if (process.env.DEBUG_COLORS || process.env.FORCE_COLOR)
        useColors = true;
    const colors = useColors ? color_1.colors : color_1.noColors;
    return {
        resolveFiles: "cwd",
        isTTY,
        ttyWidth,
        ttyHeight,
        colors,
    };
})();
