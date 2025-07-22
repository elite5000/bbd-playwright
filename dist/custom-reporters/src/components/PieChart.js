"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PieChart;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auto_1 = __importDefault(require("chart.js/auto"));
function PieChart({ counters }) {
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!ref.current)
            return;
        const chart = new auto_1.default(ref.current, {
            type: "pie",
            data: {
                labels: ["Passed", "Failed", "Flaky", "Skipped"],
                datasets: [
                    {
                        data: [counters.passed, counters.failed, counters.flaky, counters.skipped],
                        backgroundColor: ["#4caf50", "#f44336", "#ffc107", "#9e9e9e"],
                    },
                ],
            },
            options: { plugins: { legend: { display: false } } },
        });
        return () => chart.destroy();
    }, [counters]);
    return (0, jsx_runtime_1.jsx)("canvas", { ref: ref, className: "square" });
}
