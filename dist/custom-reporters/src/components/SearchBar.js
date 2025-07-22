"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchBar;
const jsx_runtime_1 = require("react/jsx-runtime");
function SearchBar({ value, onChange }) {
    return ((0, jsx_runtime_1.jsxs)("form", { className: "subnav-search SummaryBar-search", style: { display: "flex", flexDirection: "row", width: "100%" }, onSubmit: e => e.preventDefault(), children: [(0, jsx_runtime_1.jsx)("svg", { "aria-hidden": "true", height: "16", viewBox: "0 0 16 16", width: "16", className: "octicon subnav-search-icon", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z" }) }), (0, jsx_runtime_1.jsx)("input", { id: "search-box", className: "form-control subnav-search-input input-contrast width-full", type: "search", placeholder: "Search tests", value: value, onChange: e => onChange(e.target.value), style: { flex: 1, marginLeft: 0 } })] }));
}
