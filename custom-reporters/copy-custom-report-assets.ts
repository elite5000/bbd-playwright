import fs from "fs";
import path from "path";

const dest = "playwright-report";
const assets = [
    "custom-reporters/index.html",
    "custom-reporters/style.css",
    "playwright-report/custom-report-data.json",
];

fs.mkdirSync(dest, { recursive: true });

assets.forEach((file) => {
    const target = path.join(dest, path.basename(file));
    fs.copyFileSync(file, target);
    console.log(`✅ Copied ${file} → ${target}`);
});
