const fs = require("fs");
const path = require("path");
const { renderKnown, renderUnknown, renderError } = require("../lib/report-template");

function loadLookup() {
  const lookupPath = path.join(process.cwd(), "data", "hardness-lookup.json");
  return JSON.parse(fs.readFileSync(lookupPath, "utf8"));
}

function findHardness(lookup, zip) {
  const exact = lookup.zips && lookup.zips[zip];
  if (exact) return exact;

  const prefixes = lookup.estimated_prefixes || {};
  const prefix = Object.keys(prefixes)
    .sort((a, b) => b.length - a.length)
    .find((candidate) => zip.startsWith(candidate));

  if (!prefix) return null;

  return {
    zip,
    ...prefixes[prefix],
    estimated: true
  };
}

module.exports = function handler(req, res) {
  const zip = String(req.query.zip || "").trim();

  if (!/^\d{5}$/.test(zip)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(renderError());
    return;
  }

  let lookup;
  try {
    lookup = loadLookup();
  } catch (err) {
    console.error("Failed to load hardness-lookup.json:", err.message);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(renderError());
    return;
  }

  const record = findHardness(lookup, zip);

  if (!record) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(renderUnknown(zip));
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(renderKnown(record));
};
