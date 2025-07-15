import {
  PlaywrightJsonReport,
  Suite,
  Spec,
  PlaywrightTest,
  PlaywrightTestResult
} from "../models/jsonReport";

export type FlatTest = {
  suiteTitle: string;
  specTitle: string;
  testTitle: string; // always present (id or title)
  testId: string;
  projectName: string;
  status: string;
  duration: number;
  retry: number;
  result: PlaywrightTestResult;
  test: PlaywrightTest;
  spec: Spec;
  suite: Suite;
  title?: string; // human-readable test title if available
  flakey?: boolean; // optional, for UI flexibility
  parentTitle?: string; // optional, for parent/describe/suite title
};

// Flattens the Playwright JSON report into a flat array of test attempts
export function flattenPlaywrightReport(report: PlaywrightJsonReport): FlatTest[] {
  const flat: FlatTest[] = [];
  for (const suite of report.suites) {
    for (const spec of suite.specs) {
      for (const test of spec.tests) {
        for (const result of test.results) {
          flat.push({
            suiteTitle: suite.title,
            specTitle: spec.title,
            testTitle: test.title || test.id, // prefer title if present
            testId: test.id,
            projectName: test.projectName,
            status: result.status,
            duration: result.duration,
            retry: result.retry,
            result,
            test,
            spec,
            suite,
            title: test.title, // for UI flexibility
            // flakey: result.flaky, // if you want to support this, add to PlaywrightTestResult
            parentTitle: suite.title // or another parent if you have a nested structure
          });
        }
      }
    }
  }
  return flat;
}
