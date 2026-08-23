const fs = require("fs");
const path = require("path");
const { renderHardestCities } = require("../lib/water-hardness-template");

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
    res.status(500).send("Error loading data");
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
  res.status(200).send(renderHardestCities(systems));
};
