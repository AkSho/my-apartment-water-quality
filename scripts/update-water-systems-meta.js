// scripts/update-water-systems-meta.js
// Writes data/water-systems.meta.json with the date data/water-systems.json last changed.
// Run whenever the data file changes, and commit the meta file with the data:
//   node scripts/update-water-systems-meta.js
// If the data file has uncommitted changes, today's date is used (the date of the commit
// about to be made); otherwise the date of its last commit.

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dataPath = "data/water-systems.json";

function run(cmd) {
  return execSync(cmd, { cwd: root, encoding: "utf8" }).trim();
}

const dirty = run(`git status --porcelain -- ${dataPath}`) !== "";
const lastModified = dirty
  ? new Date().toLocaleDateString("en-CA")
  : run(`git log -1 --format=%cs -- ${dataPath}`);

if (!/^\d{4}-\d{2}-\d{2}$/.test(lastModified)) {
  console.error(`Could not determine a date for ${dataPath}: "${lastModified}"`);
  process.exit(1);
}

const out = path.join(root, "data", "water-systems.meta.json");
fs.writeFileSync(out, JSON.stringify({ dataLastModified: lastModified }, null, 2) + "\n");
console.log(`Wrote data/water-systems.meta.json: dataLastModified = ${lastModified}${dirty ? " (uncommitted data changes, using today)" : ""}`);
