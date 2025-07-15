import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Counters } from "../models/counters";

interface PieChartProps {
  counters: Counters
}

export default function PieChart({ counters }: PieChartProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
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
