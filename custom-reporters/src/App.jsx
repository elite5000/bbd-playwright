import React, { useEffect, useState, useMemo } from "react";
import "../style.css";
import SummaryBar from "./components/SummaryBar";
import SearchBar from "./components/SearchBar";
import TagChips from "./components/TagChips";
import TestTree from "./components/TestTree";
import TestModal from "./components/TestModal";
import PieChart from "./components/PieChart";
import TestInfo from "./components/test-info";

function App() {
  const [reportData, setReportData] = useState({ tests: [] });
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [modalTest, setModalTest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load JSON report data
  useEffect(() => {
    fetch("../custom-report-data.json")
      .then((res) => res.json())
      .then((data) => setReportData(data));
  }, []);

  // Compute counters
  const counters = useMemo(() => {
    const c = { passed: 0, failed: 0, flaky: 0, skipped: 0 };
    reportData.tests.forEach((t) => c[t.status]++);
    c.all = reportData.tests.length;
    return c;
  }, [reportData]);

  // Get all unique tags
  const tags = useMemo(() => {
    return [...new Set(reportData.tests.map((t) => t.tag))].sort();
  }, [reportData]);

  // Modal open handler (for test details)
  const handleTestClick = (test) => {
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
              <SummaryBar
                counters={counters}
                selected={selectedFilters}
                onSelect={(key) => {
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
                  onToggle={(tag) =>
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : prev.concat(tag)
                    )
                  }
                />
              </div>
              <TestInfo runEndDateTime={reportData.runEndDateTime} timeTakenMs={reportData.timeTakenMs} />
            </nav>
            
          </div>
        </div>
      </header>
      <main id="tests-container" className="tree" style={{ padding: "0 1rem 2rem 1rem" }}>
        <TestTree
          tests={reportData.tests}
          filter={selectedFilters}
          tags={tags}
          selectedTags={selectedTags}
          search={search}
          onTestClick={handleTestClick}
        />
      </main>
      <TestModal
        open={modalOpen}
        test={modalTest}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

export default App;
