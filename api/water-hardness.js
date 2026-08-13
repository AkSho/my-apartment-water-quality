const fs = require("fs");
const path = require("path");
const { renderIndex, renderSystem, renderNotFound } = require("../lib/water-hardness-template");

const DEPLOY_DATE = "2026-08-13";

function loadSystems() {
  const filePath = path.join(process.cwd(), "data", "water-systems.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return data.systems;
}

module.exports = function handler(req, res) {
  let systems;
  try {
    systems = loadSystems();
  } catch (err) {
    console.error("Failed to load water-systems.json:", err.message);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(500).send(renderNotFound());
    return;
  }

  const slug = String(req.query.slug || "").trim();

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (!slug) {
    // Index page
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
    res.status(200).send(renderIndex(systems));
    return;
  }

  // System page
  const system = systems.find(s => s.slug === slug);

  if (!system) {
    res.status(404).send(renderNotFound());
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
  res.status(200).send(renderSystem(system, DEPLOY_DATE));
};
