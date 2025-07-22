"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const step_types_1 = require("./src/const/step-types");
const common_1 = require("./src/utils/common");
const error_parse_1 = require("./src/common/error-parse");
const report_output_path_1 = require("./src/common/report-output-path");
const json_reporter_base_1 = require("./src/common/json-reporter-base");
const multi_map_1 = require("./src/common/multi-map");
class JSONReporter {
    config;
    suite;
    _errors = [];
    _resolvedOutputFile;
    constructor(options) {
        this._resolvedOutputFile = (0, report_output_path_1.resolveOutputFile)("JSON", options)?.outputFile;
    }
    printsToStdio() {
        return !this._resolvedOutputFile;
    }
    onConfigure(config) {
        this.config = config;
    }
    onBegin(arg1, arg2) {
        this.config = arg1;
        this.suite = arg2;
        console.log("onBegin");
    }
    onError(error) {
        this._errors.push(error);
    }
    async onEnd(result) {
        if (!this.suite) {
            throw new Error("Suite is undefined. onBegin may not have been called.");
        }
        await outputReport(this._serializeReport(result), this._resolvedOutputFile);
    }
    _serializeReport(result) {
        const report = {
            config: {
                ...(0, common_1.removePrivateFields)(this.config),
                rootDir: (0, common_1.toPosixPath)(this.config.rootDir),
                projects: this.config.projects.map((project) => {
                    return {
                        outputDir: (0, common_1.toPosixPath)(project.outputDir),
                        repeatEach: project.repeatEach,
                        retries: project.retries,
                        metadata: project.metadata,
                        id: (0, json_reporter_base_1.getProjectId)(project),
                        name: project.name,
                        testDir: (0, common_1.toPosixPath)(project.testDir),
                        testIgnore: (0, common_1.serializePatterns)(project.testIgnore),
                        testMatch: (0, common_1.serializePatterns)(project.testMatch),
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
    _mergeSuites(suites) {
        const fileSuites = new multi_map_1.MultiMap();
        for (const projectSuite of suites) {
            const projectId = (0, json_reporter_base_1.getProjectId)(projectSuite.project());
            const projectName = projectSuite.project().name;
            console.log(projectName, "File COUNT: ", projectSuite.suites.length);
            for (const fileSuite of projectSuite.suites) {
                const file = fileSuite.location.file;
                const serialized = this._serializeSuite(projectId, projectName, fileSuite);
                if (serialized)
                    fileSuites.set(file, serialized);
            }
        }
        const results = [];
        for (const [, suites] of fileSuites) {
            const result = {
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
    _relativeLocation(location) {
        if (!location)
            return { file: "", line: 0, column: 0 };
        return {
            file: (0, common_1.toPosixPath)(path_1.default.relative(this.config.rootDir, location.file)),
            line: location.line,
            column: location.column,
        };
    }
    _locationMatches(s1, s2) {
        return (s1.file === s2.file &&
            s1.line === s2.line &&
            s1.column === s2.column);
    }
    _mergeTestsFromSuite(to, from) {
        for (const fromSuite of from.suites || []) {
            const toSuite = (to.suites || []).find((s) => s.title === fromSuite.title &&
                this._locationMatches(s, fromSuite));
            if (toSuite) {
                this._mergeTestsFromSuite(toSuite, fromSuite);
            }
            else {
                if (!to.suites)
                    to.suites = [];
                to.suites.push(fromSuite);
            }
        }
        for (const spec of from.specs || []) {
            const toSpec = to.specs.find((s) => s.title === spec.title &&
                s.file ===
                    (0, common_1.toPosixPath)(path_1.default.relative(this.config.rootDir, spec.file)) &&
                s.line === spec.line &&
                s.column === spec.column);
            if (toSpec)
                toSpec.tests.push(...spec.tests);
            else
                to.specs.push(spec);
        }
    }
    _serializeSuite(projectId, projectName, suite) {
        if (!suite.allTests().length)
            return null;
        const suites = suite.suites
            .map((suite) => this._serializeSuite(projectId, projectName, suite))
            .filter((s) => s);
        console.log(projectName, "Test COUNT: ", suite.tests.length, "current suite: ", suite.title, "SUITE COUNT: ", suites.length);
        return {
            title: suite.title,
            ...this._relativeLocation(suite.location),
            specs: suite.tests.map((test) => this._serializeTestSpec(projectId, projectName, test)),
            suites: suites.length ? suites : undefined,
            hasParentSuite: suite.parent !== undefined,
        };
    }
    _serializeTestSpec(projectId, projectName, test) {
        return {
            title: test.title,
            ok: test.ok(),
            tags: test.tags.map((tag) => tag.substring(1)), // Strip '@'.
            tests: [this._serializeTest(projectId, projectName, test)],
            id: test.id,
            ...this._relativeLocation(test.location),
        };
    }
    _serializeTest(projectId, projectName, test) {
        return {
            timeout: test.timeout,
            annotations: test.annotations,
            expectedStatus: test.expectedStatus,
            projectId,
            projectName,
            results: test.results.map((r) => this._serializeTestResult(r, test)),
            status: test.outcome(),
        };
    }
    includedCategories = new Set(step_types_1.StepTypes);
    _serializeTestResult(result, test) {
        // Cast result.steps to the extended interface for type-safe category access
        const allSteps = result.steps;
        // Filter steps by the includedCategories list (if provided)
        const steps = this.includedCategories
            ? allSteps.filter((step) => this.includedCategories.has(step.category))
            : allSteps.filter((step) => step.category === "test.step"); // default to test.step if no filter
        const jsonResult = {
            workerIndex: result.workerIndex,
            parallelIndex: result.parallelIndex,
            status: result.status,
            duration: result.duration,
            error: result.error,
            errors: result.errors.map((e) => this._serializeError(e)),
            stdout: result.stdout.map((s) => (0, common_1.stdioEntry)(s)),
            stderr: result.stderr.map((s) => (0, common_1.stdioEntry)(s)),
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
            jsonResult.errorLocation = (0, error_parse_1.prepareErrorStack)(result.error.stack).location;
        return jsonResult;
    }
    _serializeError(error) {
        return {
            message: error.message ?? "",
            location: error.location,
        };
    }
    _serializeTestStep(step) {
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
                ? subSteps.map((s) => this._serializeTestStep(s))
                : undefined,
        };
    }
}
exports.default = JSONReporter;
async function outputReport(report, resolvedOutputFile) {
    const reportString = JSON.stringify(report, undefined, 2);
    if (resolvedOutputFile) {
        await fs_1.default.promises.mkdir(path_1.default.dirname(resolvedOutputFile), {
            recursive: true,
        });
        await fs_1.default.promises.writeFile(resolvedOutputFile, reportString);
    }
    else {
        console.log(reportString);
    }
}
