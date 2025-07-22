"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const test_list_item_1 = __importDefault(require("./test-list-item"));
const TestTree = ({ tests, filter, selectedTags, search, onTestClick }) => {
    // 1. Build a map of all attempts for each testId
    const allAttemptsByTestId = {};
    tests.forEach((t) => {
        const key = t.testId;
        if (!allAttemptsByTestId[key])
            allAttemptsByTestId[key] = [];
        allAttemptsByTestId[key].push(t);
        console.log("FlatTest spec.tags:", t.file.tags, "spec.title:", t.file.title, "testTitle:", t.testTitle);
    });
    // 2. Only keep the last attempt for each testId
    const lastAttemptByTestId = {};
    // Track flaky testIds
    const flakyTestIds = new Set();
    Object.keys(allAttemptsByTestId).forEach((testId) => {
        const attempts = allAttemptsByTestId[testId];
        const sorted = attempts.slice().sort((a, b) => (a.result.retry) - (b.result.retry));
        const last = sorted[sorted.length - 1];
        const wasRetried = sorted.length > 1;
        if (wasRetried) {
            flakyTestIds.add(testId);
        }
        lastAttemptByTestId[testId] = last;
    });
    // 3. Group only the last attempts for display and counts
    const grouped = {};
    // Helper to determine test outcome, matching App.tsx logic
    function getTestOutcome(t, allTests) {
        const allAttempts = allTests.filter((otherTest) => otherTest.testId === t.testId);
        if (t.status === "flaky" && allAttempts.length - 1 === t.retry) {
            return "flaky";
        }
        else if (t.expectedStatus === "passed" && t.retry === 0 && t.status === "expected") {
            return "passed";
        }
        else if (t.expectedStatus === "skipped") {
            return "skipped";
        }
        else if (t.retry === 0 && t.status !== "flaky" && t.status !== "expected" && allAttempts.length - 1 === t.retry) {
            return "failed";
        }
        // fallback: use status
        return t.status;
    }
    Object.values(lastAttemptByTestId).forEach((t) => {
        const testTags = t.file.tags.length === 0 ? ["untagged"] : t.file.tags;
        testTags.forEach(tag => {
            if (selectedTags.length && !selectedTags.includes(tag))
                return;
            const outcome = getTestOutcome(t, tests);
            if (filter.length && !filter.includes("all") && !filter.includes(outcome))
                return;
            if (search && !(String(t.testTitle) + String(t.file.title)).toLowerCase().includes(search.toLowerCase()))
                return;
            grouped[tag] = grouped[tag] || {};
            grouped[tag][t.file.title ?? ""] = grouped[tag][t.file.title ?? ""] || [];
            grouped[tag][t.file.title ?? ""].push(t);
        });
    });
    const [openTags, setOpenTags] = (0, react_1.useState)({});
    const [openDescribes, setOpenDescribes] = (0, react_1.useState)({});
    return ((0, jsx_runtime_1.jsx)("div", { className: "chip", children: Object.keys(grouped).sort().map((tag) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: `chip-header expanded-${!!openTags[tag]}`, role: "button", onClick: () => setOpenTags((prev) => ({ ...prev, [tag]: !prev[tag] })), style: { cursor: "pointer" }, children: [(0, jsx_runtime_1.jsx)("svg", { "aria-hidden": "true", height: "16", viewBox: "0 0 16 16", width: "16", className: "octicon color-fg-muted", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z" }) }), (0, jsx_runtime_1.jsxs)("span", { children: [" AWM App: ", tag] })] }), openTags[tag] && ((0, jsx_runtime_1.jsx)("div", { className: "chip-body chip-body-no-insets", role: "region", style: { padding: "5px" }, children: Object.keys(grouped[tag]).sort().map((describe) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: `chip-header expanded-${!!openDescribes[tag + describe]}`, role: "button", onClick: () => setOpenDescribes((prev) => ({
                                    ...prev,
                                    [tag + describe]: !prev[tag + describe],
                                })), style: { cursor: "pointer" }, children: [(0, jsx_runtime_1.jsx)("svg", { "aria-hidden": "true", height: "16", viewBox: "0 0 16 16", width: "16", className: "octicon color-fg-muted", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z" }) }), (0, jsx_runtime_1.jsxs)("span", { children: [" Feature: ", describe] })] }), openDescribes[tag + describe] && ((0, jsx_runtime_1.jsx)("div", { className: "chip-body chip-body-no-insets", role: "region", children: grouped[tag][describe].map((t) => ((0, jsx_runtime_1.jsx)(test_list_item_1.default, { test: t, onClick: onTestClick }, t.testId))) }))] }, describe))) }))] }, tag))) }));
};
exports.default = TestTree;
