import React from "react";
import { formatDuration } from "./test-info";
import { FlatTest } from "../utils/flattenPlaywrightReport";
import { isFailed, isFlaky, isPassed } from "../utils/get-outcome";

interface TestListItemProps {
  test: FlatTest;
  onClick?: (test: FlatTest) => void;
}

const TestListItem: React.FC<TestListItemProps> = ({ test, onClick }) => {
  return (
    <div className={`test-file-test test-file-test-outcome-${test.status}`} onClick={() => onClick && onClick(test)} style={{ cursor: 'pointer' }} >
      <div style={{ alignItems: "flex-start" }} className="hbox">
        <div className="hbox">
          <span className="test-file-test-status-icon">
            {isFlaky(test) ?
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="octicon color-text-warning">
                    <path fillRule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path>
                  </svg>
                  : isPassed(test) ?
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className={`octicon color-icon-success`}>
                <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
              </svg>
              : isFailed(test) ?
               <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className={`octicon color-text-danger`}>
                  <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                </svg>:<svg className="octicon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"></svg>
            }
          </span>

          <div title={test.testTitle} style={{ textDecoration: "none", color: "var(--color-fg-default)", cursor: "pointer" }}>
            <span className="test-file-title"> Test: {test.testTitle}</span>
          </div>
          <div style={{ textDecoration: "none", color: "var(--color-fg-default)", cursor: "pointer" }}>
            <span className="label label-color-1" style={{ margin: "6px 0px 0px 6px" }}>{test.projectName}</span>
          </div>

        </div>
        <span data-testid="test-duration" style={{ minWidth: "50px", textAlign: "right" }}>{formatDuration(test.duration ?? 0)}</span>
      </div>
      <div className="test-file-details-row">
        <div title={test.testTitle} className="test-file-path-link" style={{ textDecoration: "none", color: "var(--color-fg-default)", cursor: "pointer" }}>
          <span className="test-file-path">{test.fileName}:{test.line}</span>
        </div>
      </div>
    </div>
  );
};

export default TestListItem;
