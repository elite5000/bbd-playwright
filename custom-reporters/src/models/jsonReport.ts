// Flattens the Playwright JSON report into a flat array of test attempts
import { z } from "zod";
import { StepTypes } from "../const/step-types";
import { TestCase } from "@playwright/test/reporter";

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    outputDir: z.string(),
    repeatEach: z.number(),
    retries: z.number(),
    metadata: z.any(),
    testDir: z.string(),
    testIgnore: z.array(z.string()),
    testMatch: z.array(z.string()),
    timeout: z.number(),
});

export const ConfigSchema = z.object({
    configFile: z.string().nullable().optional(),
    rootDir: z.string(),
    forbidOnly: z.boolean(),
    fullyParallel: z.boolean(),
    globalSetup: z.string().nullable(),
    globalTeardown: z.string().nullable(),
    globalTimeout: z.number(),
    grep: z.any(),
    grepInvert: z.any(),
    maxFailures: z.number(),
    metadata: z.any(),
    preserveOutput: z.string(),
    reporter: z.array(z.any()),
    reportSlowTests: z.any(),
    quiet: z.boolean(),
    projects: z.array(ProjectSchema),
    updateSnapshots: z.string(),
    workers: z.number(),
});

export const StatusSchema = z.enum([
    "skipped",
    "expected",
    "unexpected",
    "flaky",
]);

export const expectedStatusSchema = z.enum([
    "passed",
    "failed",
    "timedOut",
    "skipped",
    "interrupted",
]);

export const CategorySchema = z.enum(StepTypes).optional();
export const StepSchema = z.object({
    title: z.string(),
    duration: z.number(),
    category: CategorySchema,
    error: z.any().optional(),
    steps: z.array(z.any()).optional().nullable(),
});

// Minimal Zod schema for PlaywrightJsonReport
export const PlaywrightTestResultSchema = z.object({
    workerIndex: z.number(),
    parallelIndex: z.number(),
    status: z.string(),
    duration: z.number(),
    error: z.any().optional(),
    errors: z.array(z.any()).optional(),
    stdout: z.array(z.any()).optional(),
    stderr: z.array(z.any()).optional(),
    retry: z.number(),
    startTime: z.string().optional(),
    annotations: z.array(z.any()).optional(),
    attachments: z.array(z.any()).optional(),
    errorLocation: z
        .object({
            file: z.string(),
            column: z.number(),
            line: z.number(),
        })
        .optional(),
    steps: z.array(StepSchema).optional(),
});

export const PlaywrightTestSchema = z.object({
    timeout: z.number(),
    annotations: z.array(z.any()),
    expectedStatus: expectedStatusSchema,
    projectId: z.string(),
    projectName: z.string(),
    results: z.array(PlaywrightTestResultSchema),
    status: StatusSchema,
});

export const SpecSchema = z.object({
    title: z.string(),
    ok: z.boolean(),
    tags: z.array(z.string()),
    tests: z.array(PlaywrightTestSchema),
    id: z.string(),
    file: z.string(),
    line: z.number(),
    column: z.number(),
});

export const JSONReportSuiteSchema: z.ZodType<Suite> = z.lazy(() =>
    z.object({
        title: z.string(),
        file: z.string(),
        column: z.number(),
        line: z.number(),
        specs: z.array(SpecSchema),
        suites: z.array(JSONReportSuiteSchema).optional(),
        hasParentSuite: z.boolean(),
    })
);

export const PlaywrightJsonReportSchema = z.object({
    config: ConfigSchema,
    suites: z.array(JSONReportSuiteSchema),
    errors: z.array(z.any()).optional(),
    stats: z.any().optional(),
});

export type Status = z.infer<typeof StatusSchema>;
export type Step = z.infer<typeof StepSchema>;
export type expectedStatus = z.infer<typeof expectedStatusSchema>;
export type PlaywrightJsonReport = z.infer<typeof PlaywrightJsonReportSchema>;

export type Suite = {
    title: string;
    file: string;
    column: number;
    line: number;
    specs: Spec[];
    suites?: Suite[];
    hasParentSuite: boolean;
};

export type Spec = z.infer<typeof SpecSchema>;

export type PlaywrightTest = z.infer<typeof PlaywrightTestSchema>;

export type PlaywrightTestResult = z.infer<typeof PlaywrightTestResultSchema>;

export type FlatTest = {
    fileName: string;
    testTitle: string; // always present (id or title)
    testId: string;
    projectName: string;
    status: Status;
    expectedStatus: expectedStatus;
    duration: number;
    retry: number;
    result: PlaywrightTestResult;
    maxRetries: number;
    project?: Project;
    file: Spec;
    test: PlaywrightTest;
    line: number;
    describe: Suite;
    describeTitle?: string; // optional, for parent/describe/suite title
};

export type Project = z.infer<typeof ProjectSchema>;

export type JSONReportTestStep = z.infer<typeof StepSchema>;
