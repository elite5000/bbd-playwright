import {
    Location,
    FullConfig,
    FullResult,
    Suite as PlaywrightSuite,
    TestError,
    TestCase,
    TestResult,
    JSONReportError,
    Reporter,
} from "@playwright/test/reporter";
import {
    JsonReporterOptions,
    TestStepWithCategory,
} from "./src/models/json-types";
import path from "path";
import fs from "fs";
import { StepTypes } from "./src/const/step-types";
import {
    PlaywrightJsonReport,
    PlaywrightTestResult,
    PlaywrightTest,
    Spec,
    Suite,
    JSONReportTestStep,
} from "./src/models/jsonReport";
import {
    removePrivateFields,
    serializePatterns,
    stdioEntry,
    toPosixPath,
} from "./src/utils/common";
import { prepareErrorStack } from "./src/common/error-parse";
import { resolveOutputFile } from "./src/common/report-output-path";
import { getProjectId } from "./src/common/json-reporter-base";
import { MultiMap } from "./src/common/multi-map";

export default class JSONReporter implements Reporter {
    config!: FullConfig;
    suite!: PlaywrightSuite;
    private _errors: TestError[] = [];
    private _resolvedOutputFile: string | undefined;

    constructor(options: JsonReporterOptions) {
        this._resolvedOutputFile = resolveOutputFile(
            "JSON",
            options
        )?.outputFile;
    }

    printsToStdio() {
        return !this._resolvedOutputFile;
    }

    onConfigure(config: FullConfig) {
        this.config = config;
    }

    onBegin(arg1: FullConfig, arg2: PlaywrightSuite): void {
        this.config = arg1 as FullConfig;
        this.suite = arg2;
        console.log("onBegin");
    }

    onError(error: TestError): void {
        this._errors.push(error);
    }

    async onEnd(result: FullResult) {
        if (!this.suite) {
            throw new Error(
                "Suite is undefined. onBegin may not have been called."
            );
        }
        await outputReport(
            this._serializeReport(result),
            this._resolvedOutputFile
        );
    }

    private _serializeReport(result: FullResult): PlaywrightJsonReport {
        const report: PlaywrightJsonReport = {
            config: {
                ...removePrivateFields(this.config),
                rootDir: toPosixPath(this.config.rootDir),
                projects: this.config.projects.map((project) => {
                    return {
                        outputDir: toPosixPath(project.outputDir),
                        repeatEach: project.repeatEach,
                        retries: project.retries,
                        metadata: project.metadata,
                        id: getProjectId(project),
                        name: project.name,
                        testDir: toPosixPath(project.testDir),
                        testIgnore: serializePatterns(project.testIgnore),
                        testMatch: serializePatterns(project.testMatch),
                        timeout: project.timeout,
                    };
                }),
            },
            suites: this._mergeSuites(this.suite.suites),
            errors: this._errors,
            stats: {
                startTime: result.startTime.toISOString(),
                duration: result.duration,
                expected: 0,
                skipped: 0,
                unexpected: 0,
                flaky: 0,
            },
        };
        for (const test of this.suite.allTests())
            ++report.stats[test.outcome()];
        return report;
    }

    private _mergeSuites(suites: PlaywrightSuite[]): Suite[] {
        const fileSuites: MultiMap<string, Suite> = new MultiMap<
            string,
            Suite
        >();
        for (const projectSuite of suites) {
            const projectId = getProjectId(projectSuite.project()!);
            const projectName = projectSuite.project()!.name;
            console.log(
                projectName,
                "File COUNT: ",
                projectSuite.suites.length
            );
            for (const fileSuite of projectSuite.suites) {
                const file = fileSuite.location!.file;
                const serialized = this._serializeSuite(
                    projectId,
                    projectName,
                    fileSuite
                );
                if (serialized) fileSuites.set(file, serialized);
            }
        }

        const results: Suite[] = [];
        for (const [, suites] of fileSuites) {
            const result: Suite = {
                title: suites[0].title,
                file: suites[0].file,
                column: 0,
                line: 0,
                specs: [],
                hasParentSuite: false,
            };

            for (const suite of suites)
                this._mergeTestsFromSuite(result, suite);

            results.push(result);
        }
        return results;
    }

    private _relativeLocation(location: Location | undefined): Location {
        if (!location) return { file: "", line: 0, column: 0 };
        return {
            file: toPosixPath(
                path.relative(this.config.rootDir, location.file)
            ),
            line: location.line,
            column: location.column,
        };
    }

    private _locationMatches(s1: Suite | Spec, s2: Suite | Spec) {
        return (
            s1.file === s2.file &&
            s1.line === s2.line &&
            s1.column === s2.column
        );
    }

    private _mergeTestsFromSuite(to: Suite, from: Suite) {
        for (const fromSuite of from.suites || []) {
            const toSuite = (to.suites || []).find(
                (s) =>
                    s.title === fromSuite.title &&
                    this._locationMatches(s, fromSuite)
            );
            if (toSuite) {
                this._mergeTestsFromSuite(toSuite, fromSuite);
            } else {
                if (!to.suites) to.suites = [];
                to.suites.push(fromSuite);
            }
        }

        for (const spec of from.specs || []) {
            const toSpec = to.specs.find(
                (s) =>
                    s.title === spec.title &&
                    s.file ===
                        toPosixPath(
                            path.relative(this.config.rootDir, spec.file)
                        ) &&
                    s.line === spec.line &&
                    s.column === spec.column
            );
            if (toSpec) toSpec.tests.push(...spec.tests);
            else to.specs.push(spec);
        }
    }

    private _serializeSuite(
        projectId: string,
        projectName: string,
        suite: PlaywrightSuite
    ): null | Suite {
        if (!suite.allTests().length) return null;
        const suites = suite.suites
            .map((suite) => this._serializeSuite(projectId, projectName, suite))
            .filter((s) => s) as Suite[];
        console.log(
            projectName,
            "Test COUNT: ",
            suite.tests.length,
            "current suite: ",
            suite.title,
            "SUITE COUNT: ",
            suites.length
        );
        return {
            title: suite.title,
            ...this._relativeLocation(suite.location),
            specs: suite.tests.map((test) =>
                this._serializeTestSpec(projectId, projectName, test)
            ),
            suites: suites.length ? suites : undefined,
            hasParentSuite: suite.parent !== undefined,
        };
    }

    private _serializeTestSpec(
        projectId: string,
        projectName: string,
        test: TestCase
    ): Spec {
        return {
            title: test.title,
            ok: test.ok(),
            tags: test.tags.map((tag) => tag.substring(1)), // Strip '@'.
            tests: [this._serializeTest(projectId, projectName, test)],
            id: test.id,
            ...this._relativeLocation(test.location),
        };
    }

    private _serializeTest(
        projectId: string,
        projectName: string,
        test: TestCase
    ): PlaywrightTest {
        return {
            timeout: test.timeout,
            annotations: test.annotations,
            expectedStatus: test.expectedStatus,
            projectId,
            projectName,
            results: test.results.map((r) =>
                this._serializeTestResult(r, test)
            ),
            status: test.outcome(),
        };
    }
    private includedCategories = new Set(StepTypes);

    private _serializeTestResult(
        result: TestResult,
        test: TestCase
    ): PlaywrightTestResult {
        // Cast result.steps to the extended interface for type-safe category access
        const allSteps = result.steps as TestStepWithCategory[];
        // Filter steps by the includedCategories list (if provided)
        const steps = this.includedCategories
            ? allSteps.filter((step) =>
                  this.includedCategories.has(step.category)
              )
            : allSteps.filter((step) => step.category === "test.step"); // default to test.step if no filter

        const jsonResult: PlaywrightTestResult = {
            workerIndex: result.workerIndex,
            parallelIndex: result.parallelIndex,
            status: result.status,
            duration: result.duration,
            error: result.error,
            errors: result.errors.map((e) => this._serializeError(e)),
            stdout: result.stdout.map((s) => stdioEntry(s)),
            stderr: result.stderr.map((s) => stdioEntry(s)),
            retry: result.retry,
            steps: steps.length
                ? steps.map((s) => this._serializeTestStep(s))
                : undefined,
            startTime: result.startTime.toISOString(),
            annotations: result.annotations,
            attachments: result.attachments.map((a) => ({
                name: a.name,
                contentType: a.contentType,
                path: a.path,
                body: a.body?.toString("base64"),
            })),
        };
        if (result.error?.stack)
            jsonResult.errorLocation = prepareErrorStack(
                result.error.stack
            ).location;
        return jsonResult;
    }

    private _serializeError(error: TestError): JSONReportError {
        return {
            message: error.message ?? "",
            location: error.location,
        };
    }

    private _serializeTestStep(step: TestStepWithCategory): JSONReportTestStep {
        // Filter sub-steps by includedCategories (or default category filter)
        const subSteps = this.includedCategories
            ? step.steps.filter((s) => this.includedCategories.has(s.category))
            : step.steps.filter((s) => s.category === "test.step");
        return {
            title: step.title,
            duration: step.duration,
            error: step.error,
            category: step.category,
            steps: subSteps.length
                ? subSteps.map((s) =>
                      this._serializeTestStep(s as TestStepWithCategory)
                  )
                : undefined,
        };
    }
}

async function outputReport(
    report: PlaywrightJsonReport,
    resolvedOutputFile: string | undefined
) {
    const reportString = JSON.stringify(report, undefined, 2);
    if (resolvedOutputFile) {
        await fs.promises.mkdir(path.dirname(resolvedOutputFile), {
            recursive: true,
        });
        await fs.promises.writeFile(resolvedOutputFile, reportString);
    } else {
        console.log(reportString);
    }
}
