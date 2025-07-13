import React from "react";

export default function TestModal({ open, test, onClose }) {
  if (!open || !test) return null;
  return (
    <dialog open={open} style={{ zIndex: 10 }}>
      <article style={{ minWidth: "70vw" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>{test.describe + " › " + test.title}</h2>
          <button onClick={onClose}>✕</button>
        </header>
        <section>
          {test.steps && test.steps.map((s, i) => (
            <div key={i}>{(s.status === "passed" ? "✔" : "✖") + " " + s.name}</div>
          ))}
        </section>
        {/* Chart can be added here if needed */}
      </article>
    </dialog>
  );
}
