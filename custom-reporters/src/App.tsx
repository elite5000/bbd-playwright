import React, { useEffect, useState, useMemo } from "react";
import "../style.css";
import SummaryBar from "./components/SummaryBar";
import SearchBar from "./components/SearchBar";
import TagChips from "./components/TagChips";
import TestTree from "./components/TestTree";
import TestModal from "./components/TestModal";
import PieChart from "./components/PieChart";
import TestInfo from "./components/test-info";
import { Counters } from "./models/counters";
import { PlaywrightJsonReport } from "./models/jsonReport";
import { flattenPlaywrightReport, FlatTest } from "./utils/flattenPlaywrightReport";

const App: React.FC = () => {
  const [reportData, setReportData] = useState<PlaywrightJsonReport | null>(null);
  const [flatTests, setFlatTests] = useState<FlatTest[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [modalTest, setModalTest] = useState<FlatTest | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Load JSON report data
  useEffect(() => {
    fetch("../json-results.json")
      .then((res) => res.json())
      .then((data) => {
        setReportData(data);
        setFlatTests(flattenPlaywrightReport(data));
      });
  }, []);

  // Compute counters using deduped/flaky logic (same as TestTree)
  const counters: Counters = useMemo(() => {
    // Group by testId and take the last retry for each
    const allAttemptsByTestId: Record<string, FlatTest[]> = {};
    flatTests.forEach((t) => {
      const key = t.testId;
      if (!allAttemptsByTestId[key]) allAttemptsByTestId[key] = [];
      allAttemptsByTestId[key].push(t);
    });
    const lastAttemptByTestId: Record<string, FlatTest> = {};
    Object.keys(allAttemptsByTestId).forEach((testId) => {
      const attempts = allAttemptsByTestId[testId];
      const sorted = attempts.slice().sort((a, b) => a.retry - b.retry);
      lastAttemptByTestId[testId] = sorted[sorted.length - 1];
    });
    const c: Counters = { all: 0, passed: 0, failed: 0, flaky: 0, skipped: 0 };
    Object.values(lastAttemptByTestId).forEach((t) => {
      if (t.status === "flaky") {
        c.flaky++;
      } else if (t.status === "passed" || t.status === "failed" || t.status === "skipped") {
        c[t.status]++;
      } else {
        c.failed++;
      }
    });
    c.all = c.passed + c.failed + c.flaky + c.skipped;
    return c;
  }, [flatTests]);

  // Get all unique tags
  const tags = useMemo(() => {
    return [
      ...new Set(flatTests.flatMap((t) => t.spec.tags ?? ["untagged"]))
    ].sort();
  }, [flatTests]);

  // Modal open handler (for test details)
  const handleTestClick = (test: FlatTest) => {
    setModalTest(test);
    setModalOpen(true);
  };

  return (
    <div className="htmlreport vbox px-4 pb-4">
      <header style={{ margin: "1rem", overflow: "hidden", display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          <div className="square" style={{ flex: 1, width: "10%", float: "right" }}>
            <PieChart counters={counters} />
          </div>
          <div className="header-view-status-container ml-2 pl-2 d-flex" style={{ width: "75%" }}>
            <nav style={{ flex: "auto", width: "100%", float: "right", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <h1 className="app-title">
                Playwright Test Report
              </h1>
              <SummaryBar
                counters={counters}
                selected={selectedFilters}
                onSelect={(key: string) => {
                  setSelectedFilters((prev) =>
                    prev.includes(key)
                      ? prev.filter((k) => k !== key && k !== "all")
                      : key === "all"
                        ? ["all"]
                        : prev.filter((k) => k !== "all").concat(key)
                  );
                }}
              />
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <SearchBar value={search} onChange={setSearch} />
                <TagChips
                  tags={tags}
                  selectedTags={selectedTags}
                  onToggle={(tag: string) =>
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : prev.concat(tag)
                    )
                  }
                />
              </div>
              {reportData && reportData.stats && (
                <TestInfo
                  runEndDateTime={reportData.stats.startTime}
                  timeTakenMs={reportData.stats.duration}
                />
              )}
            </nav>

          </div>
        </div>
      </header>
      <main id="tests-container" className="tree" style={{ padding: "0 1rem 2rem 1rem" }}>
        <TestTree
          tests={flatTests}
          filter={selectedFilters}
          tags={tags}
          selectedTags={selectedTags}
          search={search}
          onTestClick={handleTestClick}
        />
      </main>
      {modalTest && (
        <TestModal
          open={modalOpen}
          test={modalTest}
          allAttempts={flatTests.filter((t) => t.testId === modalTest.testId)}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
