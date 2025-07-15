import { TestInfo } from "@playwright/test";
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
        this.results.push({
            id: this.results.length + 1,
            testId: test.id,
            test: test,
            result: result,
        });
    }

    private startTime: number = Date.now();

    async onEnd() {
        const endTime = Date.now();
        const output = {
            reportTitle: "Playwright Test Report",
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
