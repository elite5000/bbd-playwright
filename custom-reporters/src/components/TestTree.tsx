import React, { useState } from "react";
import TestListItem from "./test-list-item";
import { FlatTest } from "../utils/flattenPlaywrightReport";

interface TestTreeProps {
  tests: FlatTest[];
  tags: string[];
  selectedTags: string[];
  search: string;
  filter: string[];
  onTestClick: (test: FlatTest) => void;
}

type GroupedTests = Record<string, Record<string, FlatTest[]>>;

const TestTree: React.FC<TestTreeProps> = ({ tests, filter, tags, selectedTags, search, onTestClick }) => {
  // 1. Build a map of all attempts for each testId
  const allAttemptsByTestId: Record<string, FlatTest[]> = {};
  tests.forEach((t) => {
    const key = t.testId;
    if (!allAttemptsByTestId[key]) allAttemptsByTestId[key] = [];
    allAttemptsByTestId[key].push(t);
  });

  // 2. Only keep the last attempt for each testId
  const lastAttemptByTestId: Record<string, FlatTest> = {};
  // Track flaky testIds
  const flakyTestIds = new Set<string>();
  Object.keys(allAttemptsByTestId).forEach((testId) => {
    const attempts = allAttemptsByTestId[testId];
    const sorted = attempts.slice().sort((a, b) => a.result?.retry - b.result?.retry);
    const last = sorted[sorted.length - 1];
    const wasRetried = sorted.length > 1 && last.status === "passed" && sorted.slice(0, -1).some(attempt => attempt.status !== "passed");
    if (wasRetried) {
      flakyTestIds.add(testId);
    }
    lastAttemptByTestId[testId] = last;
  });

  // 3. Group only the last attempts for display and counts
  const grouped: Record<string, Record<string, FlatTest[]>> = {};
  Object.values(lastAttemptByTestId).forEach((t) => {
    const testTags = t.spec.tags ?? ["untagged"];
    testTags.forEach(tag => {
      if (selectedTags.length && !selectedTags.includes(tag)) return;
      const effectiveStatus = flakyTestIds.has(t.testId) ? ["flaky", "passed"] : [t.status];
      if (filter.length && !filter.includes("all") && !effectiveStatus.some(status => filter.includes(status))) return;
      if (search && !(String(t.testTitle) + String(t.spec.title)).toLowerCase().includes(search.toLowerCase())) return;
      grouped[tag] = grouped[tag] || {};
      grouped[tag][t.spec.title ?? ""] = grouped[tag][t.spec.title ?? ""] || [];
      grouped[tag][t.spec.title ?? ""].push(t);
    });
  });

  const [openTags, setOpenTags] = useState<Record<string, boolean>>({});
  const [openDescribes, setOpenDescribes] = useState<Record<string, boolean>>({});

  return (
    <div className="chip">
      {Object.keys(grouped).sort().map((tag) => (
        <div key={tag}>
          <div
            className={`chip-header expanded-${!!openTags[tag]}`}
            role="button"
            onClick={() => setOpenTags((prev) => ({ ...prev, [tag]: !prev[tag] }))}
            style={{ cursor: "pointer" }}
          >
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" className="octicon color-fg-muted">
              <path fillRule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path>
            </svg>
            <span> {tag}</span>
          </div>
          {openTags[tag] && (
            <div className="chip-body chip-body-no-insets" role="region" style={{ padding: "5px" }}>
              {Object.keys(grouped[tag]).sort().map((describe) => (
                <div key={describe}>
                  <div
                    className={`chip-header expanded-${!!openDescribes[tag + describe]}`}
                    role="button"
                    onClick={() =>
                      setOpenDescribes((prev) => ({
                        ...prev,
                        [tag + describe]: !prev[tag + describe],
                      }))
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" className="octicon color-fg-muted">
                      <path fillRule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path>
                    </svg>
                    <span> {describe}</span>
                  </div>
                  {openDescribes[tag + describe] && (
                    <div className="chip-body chip-body-no-insets" role="region">
                      {grouped[tag][describe].map((t) => (
                        <TestListItem key={t.testId} test={t} onClick={onTestClick} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TestTree;
