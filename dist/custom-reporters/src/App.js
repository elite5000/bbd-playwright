"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("../style.css");
const SummaryBar_1 = __importDefault(require("./components/SummaryBar"));
const SearchBar_1 = __importDefault(require("./components/SearchBar"));
const TagChips_1 = __importDefault(require("./components/TagChips"));
const TestTree_1 = __importDefault(require("./components/TestTree"));
const TestModal_1 = __importDefault(require("./components/TestModal"));
const PieChart_1 = __importDefault(require("./components/PieChart"));
const test_info_1 = __importDefault(require("./components/test-info"));
const flattenPlaywrightReport_1 = require("./utils/flattenPlaywrightReport");
const App = () => {
    const [reportData, setReportData] = (0, react_1.useState)(null);
    const [flatTests, setFlatTests] = (0, react_1.useState)([]);
    const [search, setSearch] = (0, react_1.useState)("");
    const [selectedFilters, setSelectedFilters] = (0, react_1.useState)(["all"]);
    const [selectedTags, setSelectedTags] = (0, react_1.useState)([]);
    const [modalTest, setModalTest] = (0, react_1.useState)(null);
    const [modalOpen, setModalOpen] = (0, react_1.useState)(false);
    // Load JSON report data
    (0, react_1.useEffect)(() => {
        fetch("../json-results.json")
            .then((res) => res.json())
            .then((data) => {
            setReportData(data);
            const flat = (0, flattenPlaywrightReport_1.flattenPlaywrightReport)(data);
            console.log("flattened", flat);
            setFlatTests(flat);
        });
    }, []);
    // Compute counters using deduped/flaky logic (same as TestTree)
    const counters = (0, react_1.useMemo)(() => {
        const c = { all: 0, passed: 0, failed: 0, flaky: 0, skipped: 0 };
        Object.values(flatTests).forEach((t) => {
            const allAttempts = flatTests.filter((otherTest) => otherTest.testId === t.testId);
            if (t.status === "flaky" && allAttempts.length - 1 === t.retry) {
                c.flaky++;
            }
            else if (t.expectedStatus === "passed" && t.retry === 0 && t.status === "expected") {
                c.passed++;
            }
            else if (t.expectedStatus === "skipped") {
                c.skipped++;
            }
            else if (t.retry === 0 && t.status !== "flaky" && t.status !== "expected" && allAttempts.length - 1 === t.maxRetries) {
                c.failed++;
            }
        });
        c.all = c.passed + c.failed + c.flaky + c.skipped;
        return c;
    }, [flatTests]);
    // Get all unique tags
    const tags = (0, react_1.useMemo)(() => {
        const tagSet = new Set();
        flatTests.forEach((t) => {
            // Use "untagged" if t.spec.tags is missing or empty
            const theseTags = t.file.tags && t.file.tags.length ? t.file.tags : ["untagged"];
            theseTags.forEach((tag) => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
    }, [flatTests]);
    // Modal open handler (for test details)
    const handleTestClick = (test) => {
        setModalTest(test);
        setModalOpen(true);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "htmlreport vbox px-4 pb-4", children: [(0, jsx_runtime_1.jsx)("header", { style: { margin: "1rem", overflow: "hidden", display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: "flex", gap: "1rem", width: "100%" }, children: [(0, jsx_runtime_1.jsx)("div", { className: "square", style: { flex: 1, width: "10%", float: "right" }, children: (0, jsx_runtime_1.jsx)(PieChart_1.default, { counters: counters }) }), (0, jsx_runtime_1.jsx)("div", { className: "header-view-status-container ml-2 pl-2 d-flex", style: { width: "75%" }, children: (0, jsx_runtime_1.jsxs)("nav", { style: { flex: "auto", width: "100%", float: "right", display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [(0, jsx_runtime_1.jsx)("h1", { className: "app-title", children: "Playwright Test Report" }), (0, jsx_runtime_1.jsx)(SummaryBar_1.default, { counters: counters, selected: selectedFilters, onSelect: (key) => {
                                            setSelectedFilters((prev) => prev.includes(key)
                                                ? prev.filter((k) => k !== key && k !== "all")
                                                : key === "all"
                                                    ? ["all"]
                                                    : prev.filter((k) => k !== "all").concat(key));
                                        } }), (0, jsx_runtime_1.jsxs)("div", { style: { width: "100%", display: "flex", flexDirection: "column", gap: "0.25rem" }, children: [(0, jsx_runtime_1.jsx)(SearchBar_1.default, { value: search, onChange: setSearch }), (0, jsx_runtime_1.jsx)(TagChips_1.default, { tags: tags, selectedTags: selectedTags, onToggle: (tag) => setSelectedTags((prev) => prev.includes(tag)
                                                    ? prev.filter((t) => t !== tag)
                                                    : prev.concat(tag)) })] }), reportData && reportData.stats && ((0, jsx_runtime_1.jsx)(test_info_1.default, { runEndDateTime: reportData.stats.startTime, timeTakenMs: reportData.stats.duration }))] }) })] }) }), (0, jsx_runtime_1.jsx)("main", { id: "tests-container", className: "tree", style: { padding: "0 1rem 2rem 1rem" }, children: (0, jsx_runtime_1.jsx)(TestTree_1.default, { tests: flatTests, filter: selectedFilters, selectedTags: selectedTags, search: search, onTestClick: handleTestClick }) }), modalTest && ((0, jsx_runtime_1.jsx)(TestModal_1.default, { open: modalOpen, test: modalTest, allAttempts: flatTests.filter((t) => t.testId === modalTest.testId), onClose: () => setModalOpen(false) }))] }));
};
exports.default = App;
