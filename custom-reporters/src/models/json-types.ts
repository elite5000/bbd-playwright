import {
    FullConfig,
    Reporter,
    Suite,
    TestStep,
} from "@playwright/test/reporter";
import { Colors } from "../common/color";

export interface TestStepWithCategory extends TestStep {
    category: string;
    steps: TestStepWithCategory[]; // Ensure nested steps are of the extended type
}
export type StackFrame = {
    file: string;
    line: number;
    column: number;
    function?: string;
};
export type Screen = {
    resolveFiles: "cwd" | "rootDir";
    colors: Colors;
    isTTY: boolean;
    ttyWidth: number;
    ttyHeight: number;
};

export type JsonReporterOptions = {
    configDir: string;
    outputDir?: string;
    fileName?: string;
    outputFile?: string;
    default?: {
        fileName: string;
        outputDir: string;
    };
};
