import React from "react";

export default function TagChips({ tags, selectedTags, onToggle }) {
  return (
    <div id="tag-chips" style={{ display: "flex", gap: ".35rem", flexWrap: "wrap", position: "relative" }}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={
            "chip label label-color-" + (selectedTags.includes(tag) ? "6" : "0") + (selectedTags.includes(tag) ? " selected" : "")
          }
          style={{ margin: "6px 0px 0px 6px", cursor: "pointer" }}
          onClick={() => onToggle(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
