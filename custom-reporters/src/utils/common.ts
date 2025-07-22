import { FullConfig } from "@playwright/test";
import path from "path";

export function stdioEntry(s: string | Buffer): any {
    if (typeof s === "string") return { text: s };
    return { buffer: s.toString("base64") };
}

export function removePrivateFields(config: FullConfig): FullConfig {
    return Object.fromEntries(
        Object.entries(config).filter(([name, value]) => !name.startsWith("_"))
    ) as FullConfig;
}

export function serializePatterns(
    patterns: string | RegExp | (string | RegExp)[]
): string[] {
    if (!Array.isArray(patterns)) patterns = [patterns];
    return patterns.map((s) => s.toString());
}

export function toPosixPath(aPath: string): string {
    return aPath.split(path.sep).join(path.posix.sep);
}
