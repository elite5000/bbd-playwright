"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const CollapsibleSteps_1 = __importDefault(require("./CollapsibleSteps"));
const TestModal = ({ open, test, allAttempts = [], onClose }) => {
    const [selectedIdx, setSelectedIdx] = (0, react_1.useState)(allAttempts.length ? allAttempts.length - 1 : 0);
    if (!open || !test)
        return null;
    const attempts = allAttempts.length ? allAttempts : [test];
    const current = attempts[selectedIdx] || test;
    return ((0, jsx_runtime_1.jsx)("dialog", { open: open, style: { zIndex: 10 }, children: (0, jsx_runtime_1.jsxs)("article", { style: { minWidth: "70vw" }, children: [(0, jsx_runtime_1.jsxs)("header", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)("h2", { children: (current.describeTitle || "") + "  " + (current.projectName || "") }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, children: "\u2715" })] }), (0, jsx_runtime_1.jsx)("nav", { style: { display: "flex", gap: 8, marginBottom: 12 }, children: attempts.map((a, i) => ((0, jsx_runtime_1.jsxs)("button", { style: {
                            fontWeight: i === selectedIdx ? "bold" : "normal",
                            borderBottom: i === selectedIdx ? "2px solid #fbbd08" : "none",
                            background: "none",
                            color: a.status === "expected" ? "#ff4136" : a.status === "flaky" ? "#fbbd08" : a.status === "unexpected" ? "#ff4136" : "#2ecc40",
                            cursor: "pointer",
                            padding: "2px 8px"
                        }, onClick: () => setSelectedIdx(i), children: ["Try #", i + 1, " ", a.result?.status, " ", a.result?.duration ? `(${a.result?.duration}ms)` : ""] }, i))) }), current.result?.error && ((0, jsx_runtime_1.jsxs)("section", { style: { background: '#2d2d2d', color: '#ff4136', padding: 12, borderRadius: 6, marginBottom: 12 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 'bold', marginBottom: 4 }, children: "Error:" }), (0, jsx_runtime_1.jsx)("div", { style: { whiteSpace: 'pre-wrap', fontFamily: 'monospace', marginBottom: 4 }, children: current.result.error.message || current.result.error.message || String(current.result.error) }), current.result.error.stack && ((0, jsx_runtime_1.jsxs)("details", { style: { marginTop: 4 }, children: [(0, jsx_runtime_1.jsx)("summary", { style: { cursor: 'pointer', color: '#aaa' }, children: "Stack trace" }), (0, jsx_runtime_1.jsx)("div", { style: { whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13 }, children: current.result.error.stack })] }))] })), (0, jsx_runtime_1.jsx)(CollapsibleSteps_1.default, { steps: current.result?.steps })] }) }));
};
exports.default = TestModal;
