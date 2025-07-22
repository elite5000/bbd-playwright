"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const CollapsibleSteps = ({ steps }) => {
    const [open, setOpen] = (0, react_1.useState)(false);
    if (!steps || steps.length === 0)
        return null;
    return ((0, jsx_runtime_1.jsxs)("section", { style: { marginBottom: 12 }, children: [(0, jsx_runtime_1.jsxs)("button", { style: {
                    background: "#23272e",
                    color: "#fbbd08",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 12px",
                    cursor: "pointer",
                    marginBottom: 6,
                    fontWeight: "bold"
                }, onClick: () => setOpen((v) => !v), children: [open ? "Hide" : "Show", " Test Steps"] }), open && ((0, jsx_runtime_1.jsx)("div", { style: { background: "#23272e", borderRadius: 4, padding: 10, marginTop: 4 }, children: steps.map((s, i) => ((0, jsx_runtime_1.jsx)("div", { style: { color: !s.error ? "#2ecc40" : "#ff4136" }, children: (!s.error ? "\u2714" : "\u2716") + " " + s.title }, i))) }))] }));
};
exports.default = CollapsibleSteps;
