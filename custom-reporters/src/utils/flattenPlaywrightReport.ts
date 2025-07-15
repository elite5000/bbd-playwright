import {
    PlaywrightJsonReport,
    FlatTest,
    PlaywrightJsonReportSchema,
} from "../models/jsonReport";

export type { FlatTest };

function flattenSuite(suite: any, flat: FlatTest[]) {
    // Process this suite's specs
    if (suite.specs && Array.isArray(suite.specs)) {
        for (const spec of suite.specs) {
            for (const test of spec.tests) {
                for (const result of test.results) {
                    flat.push({
                        fileName: suite.file,
                        testTitle: spec.title,
                        testId: spec.id,
                        projectName: test.projectName,
                        status: test.status,
                        duration: result.duration,
                        retry: result.retry ?? 0,
                        result,
                        project: test,
                        test: spec,
                        file: suite,
                        describeTitle: suite.title,
                    });
                }
            }
        }
    }
    // Recursively process child suites (if any)
    if (suite.suites && Array.isArray(suite.suites)) {
        for (const childSuite of suite.suites) {
            flattenSuite(childSuite, flat);
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

    const flat: FlatTest[] = [];
    for (const suite of report.suites) {
        flattenSuite(suite, flat);
    }
    return flat;
}
