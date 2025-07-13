import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function PieChart({ counters }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, {
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
  return <canvas ref={ref} className="square" />;
}
