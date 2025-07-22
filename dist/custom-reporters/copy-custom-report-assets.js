"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dest = "playwright-report";
const assets = [
    "custom-reporters/index.html",
    "custom-reporters/style.css",
    "playwright-report/custom-report-data.json",
];
fs_1.default.mkdirSync(dest, { recursive: true });
assets.forEach((file) => {
    const target = path_1.default.join(dest, path_1.default.basename(file));
    fs_1.default.copyFileSync(file, target);
    console.log(`✅ Copied ${file} → ${target}`);
});
