import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <form className="subnav-search SummaryBar-search" style={{ display: "flex", flexDirection: "row", width: "100%" }} onSubmit={e => e.preventDefault()}>
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" className="octicon subnav-search-icon">
        <path fillRule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"></path>
      </svg>
      <input
        id="search-box"
        className="form-control subnav-search-input input-contrast width-full"
        type="search"
        placeholder="Search tests"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ flex: 1, marginLeft: 0 }}
      />
    </form>
  );
}
