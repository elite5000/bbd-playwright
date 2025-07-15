import React from "react";

interface SummaryBarProps {
  counters: Record<string, number>;
  selected: string[];
  onSelect: (key: string) => void;
}

export default function SummaryBar({ counters, selected, onSelect }: SummaryBarProps) {
  const filters = ["all", "passed", "failed", "flaky", "skipped"];
  return (
    <div className="SummaryBar" style={{ display: "flex", flexDirection: "row", gap: 0}}>
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
