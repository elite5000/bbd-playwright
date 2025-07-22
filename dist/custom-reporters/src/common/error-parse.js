"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseErrorStack = parseErrorStack;
exports.prepareErrorStack = prepareErrorStack;
const path_1 = __importDefault(require("path"));
const json_reporter_base_1 = require("./json-reporter-base");
function parseErrorStack(stack, pathSeparator, showInternalStackFrames = false) {
    const lines = stack.split("\n");
    let firstStackLine = lines.findIndex((line) => line.startsWith("    at "));
    if (firstStackLine === -1)
        firstStackLine = lines.length;
    const message = lines.slice(0, firstStackLine).join("\n");
    const stackLines = lines.slice(firstStackLine);
    let location;
    for (const line of stackLines) {
        const frame = (0, json_reporter_base_1.parseStackFrame)(line, pathSeparator, showInternalStackFrames);
        if (!frame || !frame.file)
            continue;
        if (frame.file.includes(`${pathSeparator}node_modules${pathSeparator}`))
            continue;
        location = {
            file: frame.file,
            column: frame.column || 0,
            line: frame.line || 0,
        };
        break;
    }
    return { message, stackLines, location };
}
function prepareErrorStack(stack) {
    return parseErrorStack(stack, path_1.default.sep, !!process.env.PWDEBUGIMPL);
}
