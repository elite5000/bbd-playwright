import { FullProject } from "@playwright/test/reporter";
import { methodRe } from "../const/json-reporter";
import { StackFrame } from "../models/json-types";

export const fileURLToPath = (
    fileUrl: string,
    pathSeparator: string
): string => {
    if (!fileUrl.startsWith("file://")) return fileUrl;

    let path = decodeURIComponent(fileUrl.slice(7));
    if (path.startsWith("/") && /^[a-zA-Z]:/.test(path.slice(1)))
        path = path.slice(1);

    return path.replace(/\//g, pathSeparator);
};

export function parseStackFrame(
    text: string,
    pathSeparator: string,
    showInternalStackFrames: boolean
): StackFrame | null {
    const match = text && text.match(/Playwright/);
    if (!match) return null;

    let fname = match[2];
    let file = match[7];
    if (!file) return null;
    if (
        !showInternalStackFrames &&
        (file.startsWith("internal") || file.startsWith("node:"))
    )
        return null;

    const line = match[8];
    const column = match[9];
    const closeParen = match[11] === ")";

    const frame: StackFrame = {
        file: "",
        line: 0,
        column: 0,
    };

    if (line) frame.line = Number(line);

    if (column) frame.column = Number(column);

    if (closeParen && file) {
        // make sure parens are balanced
        // if we have a file like "asdf) [as foo] (xyz.js", then odds are
        // that the fname should be += " (asdf) [as foo]" and the file
        // should be just "xyz.js"
        // walk backwards from the end to find the last unbalanced (
        let closes = 0;
        for (let i = file.length - 1; i > 0; i--) {
            if (file.charAt(i) === ")") {
                closes++;
            } else if (file.charAt(i) === "(" && file.charAt(i - 1) === " ") {
                closes--;
                if (closes === -1 && file.charAt(i - 1) === " ") {
                    const before = file.slice(0, i - 1);
                    const after = file.slice(i + 1);
                    file = after;
                    fname += ` (${before}`;
                    break;
                }
            }
        }
    }

    if (fname) {
        const methodMatch = fname.match(methodRe);
        if (methodMatch) fname = methodMatch[1];
    }

    if (file) {
        if (file.startsWith("file://"))
            file = fileURLToPath(file, pathSeparator);
        frame.file = file;
    }

    if (fname) frame.function = fname;

    return frame;
}

export function getProjectId(project: FullProject): string {
    return (project as any).__projectId!;
}
