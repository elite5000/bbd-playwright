import path from "path";
import fs from "fs";

// In addition to `outputFile` the function returns `outputDir` which should
// be cleaned up if present by some reporters contract.
export function resolveOutputFile(
    reporterName: string,
    options: {
        configDir: string;
        outputDir?: string;
        fileName?: string;
        outputFile?: string;
        default?: {
            fileName: string;
            outputDir: string;
        };
    }
): { outputFile: string; outputDir?: string } | undefined {
    const name = reporterName.toUpperCase();
    let outputFile = resolveFromEnv(`PLAYWRIGHT_${name}_OUTPUT_FILE`);
    if (!outputFile && options.outputFile)
        outputFile = path.resolve(options.configDir, options.outputFile);
    if (outputFile) return { outputFile };

    let outputDir = resolveFromEnv(`PLAYWRIGHT_${name}_OUTPUT_DIR`);
    if (!outputDir && options.outputDir)
        outputDir = path.resolve(options.configDir, options.outputDir);
    if (!outputDir && options.default)
        outputDir = resolveReporterOutputPath(
            options.default.outputDir,
            options.configDir,
            undefined
        );
    if (!outputDir) outputDir = options.configDir;

    const reportName =
        process.env[`PLAYWRIGHT_${name}_OUTPUT_NAME`] ??
        options.fileName ??
        options.default?.fileName;
    if (!reportName) return undefined;
    outputFile = path.resolve(outputDir, reportName);

    return { outputFile, outputDir };
}

export function resolveFromEnv(name: string): string | undefined {
    const value = process.env[name];
    if (value) return path.resolve(process.cwd(), value);
    return undefined;
}
export function resolveReporterOutputPath(
    defaultValue: string,
    configDir: string,
    configValue: string | undefined
) {
    if (configValue) return path.resolve(configDir, configValue);
    let basePath = getPackageJsonPath(configDir);
    basePath = basePath ? path.dirname(basePath) : process.cwd();
    return path.resolve(basePath, defaultValue);
}
const folderToPackageJsonPath = new Map<string, string>();

export function getPackageJsonPath(folderPath: string): string {
    const cached = folderToPackageJsonPath.get(folderPath);
    if (cached !== undefined) return cached;

    const packageJsonPath = path.join(folderPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
        folderToPackageJsonPath.set(folderPath, packageJsonPath);
        return packageJsonPath;
    }

    const parentFolder = path.dirname(folderPath);
    if (folderPath === parentFolder) {
        folderToPackageJsonPath.set(folderPath, "");
        return "";
    }

    const result = getPackageJsonPath(parentFolder);
    folderToPackageJsonPath.set(folderPath, result);
    return result;
}
