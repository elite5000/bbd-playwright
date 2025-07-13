import React from "react";
import { formatDuration } from "./test-info";

export default function TestListItem({ test }) {
return (
<div className={`test-file-test test-file-test-outcome-${test.status}`} >
                          <div style={{ alignItems: "flex-start" }} className="hbox">
                            <div className="hbox">
                              <span className="test-file-test-status-icon">
                                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className={`octicon color-icon-${test.status}`}>
                                  <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
                                </svg>
                              </span>
                              <span>
                                <div title={test.title} style={{textDecoration: "none", color: "var(--color-fg-default)", cursor: "pointer"}}>
                                  <span className="test-file-title">{test.title}</span>
                                </div>
                                <div style={{textDecoration: "none", color: "var(--color-fg-default)", cursor: "pointer"}}>
                                  <span className="label label-color-1" style={{margin: "6px 0px 0px 6px"}}>{test.project}</span>
                                </div>
                              </span>
                            </div>
                            <span data-testid="test-duration" style={{minWidth: "50px", textAlign: "right"}}>{formatDuration(test.timeTakenMs)}</span>
                          </div>
                          <div className="test-file-details-row">
                            <a href={`#?testId=${test.id}`} title= {test.title} className="test-file-path-link" style={{textDecoration: "none", color: "var(--color-fg-default)", cursor: "pointer"}}>
                              <span className="test-file-path">{test.fileLocation.file}:{test.fileLocation.line}</span>
                            </a>
                          </div>
                        </div>
) 
}