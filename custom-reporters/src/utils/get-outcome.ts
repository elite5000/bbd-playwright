import { FlatTest } from "./flattenPlaywrightReport";

export const isFlaky = (t: FlatTest) => t.status === "flaky";
export const isPassed = (t: FlatTest) =>
    (t.expectedStatus === "passed" || t.expectedStatus === "failed") &&
    t.status === "expected";
export const isFailed = (t: FlatTest) =>
    (t.expectedStatus === "passed" || t.expectedStatus === "failed") &&
    t.status === "unexpected";
export const isSkipped = (t: FlatTest) => t.status === "skipped";

export function getTestOutcome(
    t: FlatTest,
    allTests: FlatTest[]
): "flaky" | "passed" | "skipped" | "failed" | void {
    const allAttempts = allTests.filter(
        (otherTest) => otherTest.testId === t.testId
    );
    if (isFlaky(t) && allAttempts.length - 1 === t.retry) {
        return "flaky";
    } else if (isPassed(t) && t.retry === allAttempts.length - 1) {
        return "passed";
    } else if (isSkipped(t)) {
        return "skipped";
    } else if (isFailed(t) && allAttempts.length - 1 === t.retry) {
        return "failed";
    }
    return;
}
