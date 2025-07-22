import path from "path";
import { StackFrame } from "../models/json-types";
import { Location } from "@playwright/test/reporter";
import { parseStackFrame } from "./json-reporter-base";

export function parseErrorStack(
    stack: string,
    pathSeparator: string,
    showInternalStackFrames: boolean = false
): {
    message: string;
    stackLines: string[];
    location?: StackFrame;
} {
    const lines = stack.split("\n");
    let firstStackLine = lines.findIndex((line) => line.startsWith("    at "));
    if (firstStackLine === -1) firstStackLine = lines.length;
    const message = lines.slice(0, firstStackLine).join("\n");
    const stackLines = lines.slice(firstStackLine);
    let location: StackFrame | undefined;
    for (const line of stackLines) {
        const frame = parseStackFrame(
            line,
            pathSeparator,
            showInternalStackFrames
        );
        if (!frame || !frame.file) continue;
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

export function prepareErrorStack(stack: string): {
    message: string;
    stackLines: string[];
    location?: Location;
} {
    return parseErrorStack(stack, path.sep, !!process.env.PWDEBUGIMPL);
}
