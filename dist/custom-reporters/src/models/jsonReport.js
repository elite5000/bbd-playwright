"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaywrightJsonReportSchema = exports.JSONReportSuiteSchema = exports.SpecSchema = exports.PlaywrightTestSchema = exports.PlaywrightTestResultSchema = exports.StepSchema = exports.CategorySchema = exports.expectedStatusSchema = exports.StatusSchema = exports.ConfigSchema = exports.ProjectSchema = void 0;
// Flattens the Playwright JSON report into a flat array of test attempts
const zod_1 = require("zod");
const step_types_1 = require("../const/step-types");
exports.ProjectSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    outputDir: zod_1.z.string(),
    repeatEach: zod_1.z.number(),
    retries: zod_1.z.number(),
    metadata: zod_1.z.any(),
    testDir: zod_1.z.string(),
    testIgnore: zod_1.z.array(zod_1.z.string()),
    testMatch: zod_1.z.array(zod_1.z.string()),
    timeout: zod_1.z.number(),
});
exports.ConfigSchema = zod_1.z.object({
    configFile: zod_1.z.string().nullable().optional(),
    rootDir: zod_1.z.string(),
    forbidOnly: zod_1.z.boolean(),
    fullyParallel: zod_1.z.boolean(),
    globalSetup: zod_1.z.string().nullable(),
    globalTeardown: zod_1.z.string().nullable(),
    globalTimeout: zod_1.z.number(),
    grep: zod_1.z.any(),
    grepInvert: zod_1.z.any(),
    maxFailures: zod_1.z.number(),
    metadata: zod_1.z.any(),
    preserveOutput: zod_1.z.string(),
    reporter: zod_1.z.array(zod_1.z.any()),
    reportSlowTests: zod_1.z.any(),
    quiet: zod_1.z.boolean(),
    projects: zod_1.z.array(exports.ProjectSchema),
    updateSnapshots: zod_1.z.string(),
    workers: zod_1.z.number(),
});
exports.StatusSchema = zod_1.z.enum([
    "skipped",
    "expected",
    "unexpected",
    "flaky",
]);
exports.expectedStatusSchema = zod_1.z.enum([
    "passed",
    "failed",
    "timedOut",
    "skipped",
    "interrupted",
]);
exports.CategorySchema = zod_1.z.enum(step_types_1.StepTypes).optional();
exports.StepSchema = zod_1.z.object({
    title: zod_1.z.string(),
    duration: zod_1.z.number(),
    category: exports.CategorySchema,
    error: zod_1.z.any().optional(),
    steps: zod_1.z.array(zod_1.z.any()).optional().nullable(),
});
// Minimal Zod schema for PlaywrightJsonReport
exports.PlaywrightTestResultSchema = zod_1.z.object({
    workerIndex: zod_1.z.number(),
    parallelIndex: zod_1.z.number(),
    status: zod_1.z.string(),
    duration: zod_1.z.number(),
    error: zod_1.z.any().optional(),
    errors: zod_1.z.array(zod_1.z.any()).optional(),
    stdout: zod_1.z.array(zod_1.z.any()).optional(),
    stderr: zod_1.z.array(zod_1.z.any()).optional(),
    retry: zod_1.z.number(),
    startTime: zod_1.z.string().optional(),
    annotations: zod_1.z.array(zod_1.z.any()).optional(),
    attachments: zod_1.z.array(zod_1.z.any()).optional(),
    errorLocation: zod_1.z
        .object({
        file: zod_1.z.string(),
        column: zod_1.z.number(),
        line: zod_1.z.number(),
    })
        .optional(),
    steps: zod_1.z.array(exports.StepSchema).optional(),
});
exports.PlaywrightTestSchema = zod_1.z.object({
    timeout: zod_1.z.number(),
    annotations: zod_1.z.array(zod_1.z.any()),
    expectedStatus: exports.expectedStatusSchema,
    projectId: zod_1.z.string(),
    projectName: zod_1.z.string(),
    results: zod_1.z.array(exports.PlaywrightTestResultSchema),
    status: exports.StatusSchema,
});
exports.SpecSchema = zod_1.z.object({
    title: zod_1.z.string(),
    ok: zod_1.z.boolean(),
    tags: zod_1.z.array(zod_1.z.string()),
    tests: zod_1.z.array(exports.PlaywrightTestSchema),
    id: zod_1.z.string(),
    file: zod_1.z.string(),
    line: zod_1.z.number(),
    column: zod_1.z.number(),
});
exports.JSONReportSuiteSchema = zod_1.z.lazy(() => zod_1.z.object({
    title: zod_1.z.string(),
    file: zod_1.z.string(),
    column: zod_1.z.number(),
    line: zod_1.z.number(),
    specs: zod_1.z.array(exports.SpecSchema),
    suites: zod_1.z.array(exports.JSONReportSuiteSchema).optional(),
    hasParentSuite: zod_1.z.boolean(),
}));
exports.PlaywrightJsonReportSchema = zod_1.z.object({
    config: exports.ConfigSchema,
    suites: zod_1.z.array(exports.JSONReportSuiteSchema),
    errors: zod_1.z.array(zod_1.z.any()).optional(),
    stats: zod_1.z.any().optional(),
});
