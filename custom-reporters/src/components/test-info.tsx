import React from "react";

export function formatDuration(ms: number): string {
  if (ms < 1000) return ms + " ms";
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return sec + "s";
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  if (min < 60) return `${min}m ${s}s`;
  const hr = Math.floor(min / 60);
  const m = min % 60;
  return `${hr}h ${m}m ${s}s`;
}

interface TestInfoProps {
  runEndDateTime?: string | number | Date | null;
  timeTakenMs: number;
}

export default function TestInfo({ runEndDateTime, timeTakenMs }: TestInfoProps) {
  const dateStr = runEndDateTime
    ? new Date(runEndDateTime).toLocaleString()
    : "-";
  return (
    <div className='header-view'>
      <div className='hbox header-superheader'>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flex: "1 1 auto", flexDirection: "row" }}>
          <div data-testid="overall-time" style={{ marginRight: 10 }}>
            Run ended: {dateStr}
          </div>
          <div data-testid="overall-duration">
            Total time: {formatDuration(timeTakenMs)}
          </div>
        </div>
      </div>
    </div>
  );
}
