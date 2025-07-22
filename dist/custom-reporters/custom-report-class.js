"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CustomReporter {
    results = [];
    onTestEnd(test, result) {
        this.results.push({
            id: this.results.length + 1,
            testId: test.id,
            test: test,
            result: result,
        });
    }
    startTime = Date.now();
    async onEnd() {
        const endTime = Date.now();
        const output = {
            reportTitle: "Playwright Test Report",
            tests: this.results,
            runEndDateTime: new Date(endTime).toISOString(),
            timeTakenMs: endTime - this.startTime,
        };
        const reportDir = path_1.default.join(process.cwd(), "custom-reporters");
        fs_1.default.mkdirSync(reportDir, { recursive: true });
        const jsonPath = path_1.default.join(reportDir, "custom-report-data.json");
        fs_1.default.writeFileSync(jsonPath, JSON.stringify(output, null, 2));
        console.log(`✅ Custom JSON report written to ${jsonPath}`);
    }
}
exports.default = CustomReporter;
