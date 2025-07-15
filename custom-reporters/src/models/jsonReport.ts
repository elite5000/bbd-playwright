// Flattens the Playwright JSON report into a flat array of test attempts
import { z } from "zod";

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
    retry: z.number().optional(),
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
    steps: z
        .array(
            z.object({
                title: z.string(),
                error: z.any().optional(),
            })
        )
        .optional(),
});

export const PlaywrightTestSchema = z.object({
    timeout: z.number(),
    annotations: z.array(z.any()),
    expectedStatus: z.string(),
    projectId: z.string(),
    projectName: z.string(),
    results: z.array(PlaywrightTestResultSchema),
    status: z.string(),
    file: z.string().optional(),
    line: z.number().optional(),
    column: z.number().optional(),
});

export const SpecSchema = z.object({
    title: z.string(),
    ok: z.boolean(),
    tags: z.array(z.string()),
    tests: z.array(PlaywrightTestSchema),
    id: z.string(),
    file: z.string().optional(),
    line: z.number().optional(),
    column: z.number().optional(),
});

export const DescribeSchema = z.object({
    title: z.string(),
    file: z.string(),
    column: z.number().optional(),
    line: z.number().optional(),
    specs: z.array(SpecSchema),
});

export const FileSchema = z.object({
    title: z.string(),
    file: z.string(),
    column: z.number().optional(),
    line: z.number().optional(),
    specs: z.array(SpecSchema).optional(),
    suites: z.array(DescribeSchema).optional(),
});

export const PlaywrightJsonReportSchema = z.object({
    config: z.any(),
    suites: z.array(FileSchema),
    errors: z.array(z.any()).optional(),
    stats: z.any().optional(),
});

export type PlaywrightJsonReport = z.infer<typeof PlaywrightJsonReportSchema>;

export type File = z.infer<typeof FileSchema>;

export type Describe = z.infer<typeof DescribeSchema>;

export type Spec = z.infer<typeof SpecSchema>;

export type PlaywrightTest = z.infer<typeof PlaywrightTestSchema>;

export type PlaywrightTestResult = z.infer<typeof PlaywrightTestResultSchema>;

export type FlatTest = {
    fileName: string;
    testTitle: string; // always present (id or title)
    testId: string;
    projectName: string;
    status: string;
    duration: number;
    retry: number;
    result: PlaywrightTestResult;
    project: PlaywrightTest;
    test: Spec;
    file: File;
    describe?: Describe;
    title?: string; // human-readable test title if available
    flakey?: boolean; // optional, for UI flexibility
    describeTitle?: string; // optional, for parent/describe/suite title
};
