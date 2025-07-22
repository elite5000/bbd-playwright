"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SummaryBar;
const jsx_runtime_1 = require("react/jsx-runtime");
function SummaryBar({ counters, selected, onSelect }) {
    const filters = ["all", "passed", "failed", "flaky", "skipped"];
    return ((0, jsx_runtime_1.jsx)("div", { className: "SummaryBar", style: { display: "flex", flexDirection: "row", gap: 0 }, children: filters.map((key) => ((0, jsx_runtime_1.jsxs)("a", { className: "subnav-item", style: {
                textDecoration: "none",
                color: "var(--color-fg-default)",
                cursor: "pointer",
            }, "data-testid": `summary-${key}`, onClick: () => onSelect(key), children: [key.charAt(0).toUpperCase() + key.slice(1), (0, jsx_runtime_1.jsx)("span", { className: "d-inline counter", children: counters[key] })] }, key))) }));
}
