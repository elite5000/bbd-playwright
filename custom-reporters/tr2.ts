import type {
    Reporter,
    TestCase,
    TestResult,
    Suite,
    FullResult,
    FullConfig,
} from "@playwright/test/reporter";

const fs = require("fs");
const path = require("path");

class CustomReporter implements Reporter {
    private results: Array<{
        id: number;
        tag: any;
        describe: any;
        title: any;
        status: any;
        steps: any;
    }> = [];
    private testId = 1;

    onTestEnd(test, result) {
        const tag =
            test.annotations.find((a) => a.type === "tag")?.description ||
            "@untagged";
        const steps =
            result.steps?.map((s) => ({
                name: s.title || s.location?.file || "step",
                status: s.error ? "failed" : "passed",
            })) || [];

        this.results.push({
            id: this.testId++,
            tag,
            describe: test.parent.title,
            title: test.title,
            status: result.status,
            steps,
        });
    }

    async onEnd() {
        const output = {
            tests: this.results,
        };
        const outPath = path.join(__dirname, "custom-report-data.ts");
        fs.writeFileSync(
            outPath,
            `window.__REPORT__ = ${JSON.stringify(output, null, 2)};`
        );
    }
}

module.exports = CustomReporter;
