import React, { useState } from "react";
import { PlaywrightTestResult } from "../models/jsonReport";

interface CollapsibleStepsProps {
  steps?: PlaywrightTestResult["steps"];
}

const CollapsibleSteps: React.FC<CollapsibleStepsProps> = ({ steps }) => {
  const [open, setOpen] = useState(false);
  if (!steps || steps.length === 0) return null;
  return (
    <section style={{ marginBottom: 12 }}>
      <button
        style={{
          background: "#23272e",
          color: "#fbbd08",
          border: "none",
          borderRadius: 4,
          padding: "4px 12px",
          cursor: "pointer",
          marginBottom: 6,
          fontWeight: "bold"
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide" : "Show"} Test Steps
      </button>
      {open && (
        <div style={{ background: "#23272e", borderRadius: 4, padding: 10, marginTop: 4 }}>
          {steps.map((s: any, i: number) => (
            <div key={i} style={{ color: !s.error ? "#2ecc40" : "#ff4136" }}>
              {(!s.error ? "\u2714" : "\u2716") + " " + s.title}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CollapsibleSteps;
