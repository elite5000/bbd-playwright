import { test, expect } from '@playwright/test';
import { flattenPlaywrightReport } from '../utils/flattenPlaywrightReport';
import { PlaywrightJsonReport } from '../models/jsonReport';

test('flattenPlaywrightReport should flatten a nested PlaywrightJsonReport into a flat array of test attempts', () => {
    test("should flatten a nested PlaywrightJsonReport into a flat array of test attempts", () => {
        const mockReport: PlaywrightJsonReport = {
            config: {},
            suites: [
                {
                    title: "Suite 1",
                    specs: [
                        {
                            title: "Spec 1",
                            ok: true,
                            tags: [],
                            tests: [
                                {
                                    timeout: 30000,
                                    annotations: [],
                                    expectedStatus: "passed",
                                    projectId: "proj1",
                                    projectName: "Project 1",
                                    results: [
                                        {
                                            workerIndex: 0,
                                            parallelIndex: 0,
                                            status: "passed",
                                            duration: 123,
                                            errors: [],
                                            stdout: [],
                                            stderr: [],
                                            retry: 0,
                                            startTime:
                                                "2025-07-15T00:00:00.000Z",
                                            annotations: [],
                                            attachments: [],
                                        },
                                    ],
                                    status: "passed",
                                    id: "test-1",
                                    file: "file1.spec.ts",
                                    line: 10,
                                    column: 5,
                                },
                            ],
                            id: "spec-1",
                            file: "file1.spec.ts",
                            line: 1,
                            column: 1,
                        },
                    ],

                    file: "file1.spec.ts",
                    line: 1,
                    column: 1,
                },
            ],
            errors: [],
            stats: {
                startTime: "2025-07-15T00:00:00.000Z",
                duration: 123,
                expected: 1,
                skipped: 0,
                unexpected: 0,
                flaky: 0,
            },
        };

        const flat = flattenPlaywrightReport(mockReport);
        expect(flat).toHaveLength(1);
        expect(flat[0]).toMatchObject({
            suiteTitle: "Suite 1",
            specTitle: "Spec 1",
            testTitle: "test-1",
            testId: "test-1",
            projectName: "Project 1",
            status: "passed",
            duration: 123,
            retry: 0,
        });
    });
});
