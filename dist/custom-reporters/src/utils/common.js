"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stdioEntry = stdioEntry;
exports.removePrivateFields = removePrivateFields;
exports.serializePatterns = serializePatterns;
exports.toPosixPath = toPosixPath;
const path_1 = __importDefault(require("path"));
function stdioEntry(s) {
    if (typeof s === "string")
        return { text: s };
    return { buffer: s.toString("base64") };
}
function removePrivateFields(config) {
    return Object.fromEntries(Object.entries(config).filter(([name, value]) => !name.startsWith("_")));
}
function serializePatterns(patterns) {
    if (!Array.isArray(patterns))
        patterns = [patterns];
    return patterns.map((s) => s.toString());
}
function toPosixPath(aPath) {
    return aPath.split(path_1.default.sep).join(path_1.default.posix.sep);
}
