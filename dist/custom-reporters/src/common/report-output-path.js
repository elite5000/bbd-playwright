"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOutputFile = resolveOutputFile;
exports.resolveFromEnv = resolveFromEnv;
exports.resolveReporterOutputPath = resolveReporterOutputPath;
exports.getPackageJsonPath = getPackageJsonPath;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// In addition to `outputFile` the function returns `outputDir` which should
// be cleaned up if present by some reporters contract.
function resolveOutputFile(reporterName, options) {
    const name = reporterName.toUpperCase();
    let outputFile = resolveFromEnv(`PLAYWRIGHT_${name}_OUTPUT_FILE`);
    if (!outputFile && options.outputFile)
        outputFile = path_1.default.resolve(options.configDir, options.outputFile);
    if (outputFile)
        return { outputFile };
    let outputDir = resolveFromEnv(`PLAYWRIGHT_${name}_OUTPUT_DIR`);
    if (!outputDir && options.outputDir)
        outputDir = path_1.default.resolve(options.configDir, options.outputDir);
    if (!outputDir && options.default)
        outputDir = resolveReporterOutputPath(options.default.outputDir, options.configDir, undefined);
    if (!outputDir)
        outputDir = options.configDir;
    const reportName = process.env[`PLAYWRIGHT_${name}_OUTPUT_NAME`] ??
        options.fileName ??
        options.default?.fileName;
    if (!reportName)
        return undefined;
    outputFile = path_1.default.resolve(outputDir, reportName);
    return { outputFile, outputDir };
}
function resolveFromEnv(name) {
    const value = process.env[name];
    if (value)
        return path_1.default.resolve(process.cwd(), value);
    return undefined;
}
function resolveReporterOutputPath(defaultValue, configDir, configValue) {
    if (configValue)
        return path_1.default.resolve(configDir, configValue);
    let basePath = getPackageJsonPath(configDir);
    basePath = basePath ? path_1.default.dirname(basePath) : process.cwd();
    return path_1.default.resolve(basePath, defaultValue);
}
const folderToPackageJsonPath = new Map();
function getPackageJsonPath(folderPath) {
    const cached = folderToPackageJsonPath.get(folderPath);
    if (cached !== undefined)
        return cached;
    const packageJsonPath = path_1.default.join(folderPath, "package.json");
    if (fs_1.default.existsSync(packageJsonPath)) {
        folderToPackageJsonPath.set(folderPath, packageJsonPath);
        return packageJsonPath;
    }
    const parentFolder = path_1.default.dirname(folderPath);
    if (folderPath === parentFolder) {
        folderToPackageJsonPath.set(folderPath, "");
        return "";
    }
    const result = getPackageJsonPath(parentFolder);
    folderToPackageJsonPath.set(folderPath, result);
    return result;
}
