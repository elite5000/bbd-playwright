import React, { useState } from "react";
import CollapsibleSteps from "./CollapsibleSteps";
import { FlatTest } from "../utils/flattenPlaywrightReport";

// Types for nested test/result structure
export interface TestCase {
  id: string;
  title: string;
  describe?: string;
  tag?: string;
  project?: string;
  location?: { file: string; line: number; column?: number };
}


export interface TestStep {
  title: string;
  status: "passed" | "failed" | "skipped";
  duration?: number;
  error?: { message?: string; name?: string; stack?: string };
  steps?: TestStep[];
}

export interface TestError {
  message?: string;
  name?: string;
  stack?: string;
}

export interface TestResult {
  status: "passed" | "failed" | "flaky" | "skipped";
  duration?: number;
  retry?: number;
  attempt?: number;
  error?: TestError;
  steps?: TestStep[];
}




interface TestModalProps {
  open: boolean;
  test: FlatTest | null;
  allAttempts?: FlatTest[];
  onClose: () => void;
}

const TestModal: React.FC<TestModalProps> = ({ open, test, allAttempts = [], onClose }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(allAttempts.length ? allAttempts.length - 1 : 0);
  if (!open || !test) return null;
  const attempts = allAttempts.length ? allAttempts : [test];
  const current = attempts[selectedIdx] || test;
  return (
    <dialog open={open} style={{ zIndex: 10 }}>
      <article style={{ minWidth: "70vw" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>{(current.parentTitle || "") + "  " + (current.test?.title || "")}</h2>
          <button onClick={onClose}>✕</button>
        </header>
        <nav style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {attempts.map((a, i) => (
            <button
              key={i}
              style={{
                fontWeight: i === selectedIdx ? "bold" : "normal",
                borderBottom: i === selectedIdx ? "2px solid #fbbd08" : "none",
                background: "none",
                color: a.result?.status === "passed" ? "#2ecc40" : a.result?.status === "failed" ? "#ff4136" : a.flakey ? "#fbbd08" : "#aaa",
                cursor: "pointer",
                padding: "2px 8px"
              }}
              onClick={() => setSelectedIdx(i)}
            >
              Try #{i + 1} {a.result?.status} {a.result?.duration ? `(${a.result?.duration}ms)` : ""}
            </button>
          ))}
        </nav>
        {/* Error reporting */}
        {current.result?.error && (
          <section style={{ background: '#2d2d2d', color: '#ff4136', padding: 12, borderRadius: 6, marginBottom: 12 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Error:</div>
            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', marginBottom: 4 }}>{current.result.error.message || current.result.error.message || String(current.result.error)}</div>
            {current.result.error.stack && (
              <details style={{ marginTop: 4 }}>
                <summary style={{ cursor: 'pointer', color: '#aaa' }}>Stack trace</summary>
                <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13 }}>{current.result.error.stack}</div>
              </details>
            )}
          </section>
        )}
        {/* Collapsible test steps */}
        <CollapsibleSteps steps={current.result?.steps} />
      </article>
    </dialog>
  );
};

export default TestModal;
