import {
    PlaywrightJsonReport,
    FlatTest,
    PlaywrightJsonReportSchema,
    Suite,
    Project,
} from "../models/jsonReport";

export type { FlatTest };

export function flattenSuite(
    suite: Suite,
    flat: FlatTest[],
    project: Project[]
) {
    // Process this suite's specs
    // Recursively process child suites (if any)
    if (suite.suites && Array.isArray(suite.suites)) {
        for (const childSuite of suite.suites) {
            flattenSuite(childSuite, flat, project);
        }
    }

    for (const spec of suite.specs) {
        for (const test of spec.tests) {
            for (const result of test.results) {
                flat.push({
                    fileName: suite.file,
                    testTitle: spec.title,
                    testId: spec.id,
                    projectName: test.projectName,
                    status: test.status,
                    expectedStatus: test.expectedStatus,
                    duration: result.duration,
                    retry: result.retry,
                    maxRetries:
                        project.find((p) => p.id === test.projectId)?.retries ??
                        0,
                    project: project.find((p) => p.id === test.projectId),
                    result,
                    file: spec,
                    test,
                    describe: suite,
                    line: spec.line,
                    describeTitle: suite.hasParentSuite
                        ? suite.title
                        : undefined,
                });
            }
        }
    }
}

export function flattenPlaywrightReport(
    report: PlaywrightJsonReport
): FlatTest[] {
    // Runtime validation
    const parsed = PlaywrightJsonReportSchema.safeParse(report);
    if (!parsed.success) {
        throw new Error(
            "Invalid PlaywrightJsonReport: " + parsed.error.toString()
        );
    }
    report = parsed.data;

    const project: Project[] = report.config.projects;

    const flat: FlatTest[] = [];
    for (const suite of report.suites) {
        flattenSuite(suite, flat, project);
    }
    return flat;
}
