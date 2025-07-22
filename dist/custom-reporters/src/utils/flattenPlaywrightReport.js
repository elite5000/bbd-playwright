"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenSuite = flattenSuite;
exports.flattenPlaywrightReport = flattenPlaywrightReport;
const jsonReport_1 = require("../models/jsonReport");
function flattenSuite(suite, flat, project) {
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
                    maxRetries: project.find((p) => p.id === test.projectId)?.retries ??
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
function flattenPlaywrightReport(report) {
    // Runtime validation
    const parsed = jsonReport_1.PlaywrightJsonReportSchema.safeParse(report);
    if (!parsed.success) {
        throw new Error("Invalid PlaywrightJsonReport: " + parsed.error.toString());
    }
    report = parsed.data;
    const project = report.config.projects;
    const flat = [];
    for (const suite of report.suites) {
        flattenSuite(suite, flat, project);
    }
    return flat;
}
