"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TagChips;
const jsx_runtime_1 = require("react/jsx-runtime");
function TagChips({ tags, selectedTags, onToggle }) {
    return ((0, jsx_runtime_1.jsx)("div", { id: "tag-chips", style: { display: "flex", gap: ".35rem", flexWrap: "wrap", position: "relative" }, children: tags.map((tag) => ((0, jsx_runtime_1.jsx)("span", { className: "chip label label-color-" + (selectedTags.includes(tag) ? "6" : "0") + (selectedTags.includes(tag) ? " selected" : ""), style: { margin: "6px 0px 0px 6px", cursor: "pointer" }, onClick: () => onToggle(tag), children: tag }, tag))) }));
}
