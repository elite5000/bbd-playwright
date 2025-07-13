import React, { useState } from "react";
import TestListItem from "./test-list-item";

export default function TestTree({ tests, filter, tags, selectedTags, search }) {
  // Group by tag and describe
  const grouped = {};
  tests.forEach((t) => {
    if (selectedTags.length && !selectedTags.includes(t.tag)) return;
    if (filter.length && !filter.includes("all") && !filter.includes(t.status)) return;
    if (search && !(t.title + t.describe).toLowerCase().includes(search.toLowerCase())) return;
    grouped[t.tag] = grouped[t.tag] || {};
    grouped[t.tag][t.describe] = grouped[t.tag][t.describe] || [];
    grouped[t.tag][t.describe].push(t);
  });
  const [openTags, setOpenTags] = useState({});
  const [openDescribes, setOpenDescribes] = useState({});

  return (
    <div className="chip">
      {Object.keys(grouped).sort().map((tag) => (
        <div key={tag}>
          <div
            className={`chip-header expanded-${!!openTags[tag]}`}
            role="button"
            onClick={() => setOpenTags((prev) => ({ ...prev, [tag]: !prev[tag] }))}
            style={{ cursor: "pointer" }}
          >
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" className="octicon color-fg-muted">
              <path fillRule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path>
            </svg>
            <span> {tag}</span>
          </div>
          {openTags[tag] && (
            <div className="chip-body chip-body-no-insets" role="region" style={{ padding: "5px" }}>
              {Object.keys(grouped[tag]).sort().map((describe) => (
                <div key={describe}>
                  <div
                    className={`chip-header expanded-${!!openDescribes[tag + describe]}`}
                    role="button"
                    onClick={() =>
                      setOpenDescribes((prev) => ({
                        ...prev,
                        [tag + describe]: !prev[tag + describe],
                      }))
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" className="octicon color-fg-muted">
                      <path fillRule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path>
                    </svg>
                    <span> {describe}</span>
                  </div>
                  {openDescribes[tag + describe] && (
                    <div className="chip-body chip-body-no-insets" role="region">
                      {grouped[tag][describe].map((test) => (
                        <TestListItem test={test} key={`${test.id}-${test.title}`} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
