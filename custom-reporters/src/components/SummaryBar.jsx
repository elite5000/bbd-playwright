import React from "react";

export default function SummaryBar({ counters, selected, onSelect }) {
  const filters = ["all", "passed", "failed", "flaky", "skipped"];
  return (
    <div className="SummaryBar" style={{ display: "flex", flexDirection: "row", gap: 0, float: "center" }}>
      {filters.map((key) => (
        <a
          key={key}
          className="subnav-item"
          style={{
            textDecoration: "none",
            color: "var(--color-fg-default)",
            cursor: "pointer",
          }}
          data-testid={`summary-${key}`}
          onClick={() => onSelect(key)}
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}
          <span className="d-inline counter">{counters[key]}</span>
        </a>
      ))}
    </div>
  );
}
