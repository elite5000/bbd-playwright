"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDuration = formatDuration;
exports.default = TestInfo;
const jsx_runtime_1 = require("react/jsx-runtime");
function formatDuration(ms) {
    if (ms < 1000)
        return ms + " ms";
    const sec = Math.floor(ms / 1000);
    if (sec < 60)
        return sec + "s";
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    if (min < 60)
        return `${min}m ${s}s`;
    const hr = Math.floor(min / 60);
    const m = min % 60;
    return `${hr}h ${m}m ${s}s`;
}
function TestInfo({ runEndDateTime, timeTakenMs }) {
    const dateStr = runEndDateTime
        ? new Date(runEndDateTime).toLocaleString()
        : "-";
    return ((0, jsx_runtime_1.jsx)("div", { className: 'header-view', children: (0, jsx_runtime_1.jsx)("div", { className: 'hbox header-superheader', children: (0, jsx_runtime_1.jsxs)("div", { style: { display: "flex", gap: "1.5rem", alignItems: "center", flex: "1 1 auto", flexDirection: "row" }, children: [(0, jsx_runtime_1.jsxs)("div", { "data-testid": "overall-time", style: { marginRight: 10 }, children: ["Run ended: ", dateStr] }), (0, jsx_runtime_1.jsxs)("div", { "data-testid": "overall-duration", children: ["Total time: ", formatDuration(timeTakenMs)] })] }) }) }));
}
