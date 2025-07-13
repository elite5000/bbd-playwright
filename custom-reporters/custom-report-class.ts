import {
    FullConfig,
    Reporter,
    Suite,
    TestCase,
    TestResult,
} from "@playwright/test/reporter";
import fs from "fs";
import path from "path";

class CustomReporter implements Reporter {
    private results: any[] = [];

    onTestEnd(test: TestCase, result: TestResult) {
        const { title, parent, location } = test;
        const describe = parent.title;
        const tag =
            test.annotations.find((a) => a.type === "tag")?.description ||
            "untagged";

        const steps =
            result.steps?.map((s) => ({
                name: s.title,
                status: s.error ? "failed" : "passed",
            })) || [];

        this.results.push({
            id: this.results.length + 1,
            tag,
            describe,
            title: title,
            status: result.status,
            steps,
        });
    }

    private startTime: number = Date.now();

    async onEnd() {
        const endTime = Date.now();
        const output = {
            tests: this.results,
            runEndDateTime: new Date(endTime).toISOString(),
            timeTakenMs: endTime - this.startTime,
        };
        const reportDir = path.join(process.cwd(), "custom-reporters");
        fs.mkdirSync(reportDir, { recursive: true });

        const jsonPath = path.join(reportDir, "custom-report-data.json");
        fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2));
        console.log(`✅ Custom JSON report written to ${jsonPath}`);
    }
}

export default CustomReporter;
