#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rawDir = path.join(root, "data", "raw");
const outputPath = path.join(root, "data", "hardness-lookup.json");
const qaReportPath = path.join(root, "data", "hardness-build-report.json");
const args = new Set(process.argv.slice(2));

const SAMPLE_LOOKUP = {
  meta: {
    version: "v1-launch-seed",
    generated_at: new Date().toISOString(),
    coverage: "seed",
    source_basis: [
      "USGS hardness category definitions",
      "Official utility water quality reports for seed ZIPs"
    ],
    note: "Seed production-compatible dataset. Run this script with official raw inputs for national coverage before paid traffic."
  },
  zips: {
    "97205": {
      zip: "97205",
      ppm: 7,
      band: "Soft",
      city_or_county: "Portland, OR",
      source_label: "Portland Water Bureau water quality reporting",
      source_url: "https://www.portland.gov/water/water-quality/water-quality-reports"
    },
    "78701": {
      zip: "78701",
      ppm: 93,
      band: "Moderately hard",
      city_or_county: "Austin, TX",
      source_label: "Austin Water quality reporting",
      source_url: "https://www.austintexas.gov/department/water-quality-reports"
    },
    "60601": {
      zip: "60601",
      ppm: 148,
      band: "Hard",
      city_or_county: "Chicago, IL",
      source_label: "Chicago Department of Water Management water quality reporting",
      source_url: "https://www.chicago.gov/city/en/depts/water/supp_info/water_quality_resultsandreports.html"
    },
    "89101": {
      zip: "89101",
      ppm: 280,
      band: "Very hard",
      city_or_county: "Las Vegas, NV",
      source_label: "Las Vegas Valley Water District water quality reporting",
      source_url: "https://www.lvvwd.com/water-quality/reports/index.html"
    }
  },
  estimated_prefixes: {
    "89": {
      ppm: 280,
      band: "Very hard",
      city_or_county: "Nevada state-level estimate",
      source_label: "Estimated from state-level data",
      source_url: "https://www.usgs.gov/special-topics/water-science-school/science/hardness-water",
      estimated: true
    }
  }
};

const QA_ONLY_LOOKUP = {
  zips: {
    "85099": {
      zip: "85099",
      ppm: 420,
      band: "Very hard",
      city_or_county: "Gauge stress-test sample",
      source_label: "QA-only extreme hardness sample for marker clipping checks",
      source_url: "https://www.usgs.gov/special-topics/water-science-school/science/hardness-water",
      qa_only: true
    }
  }
};

function parseCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  if (!text) return [];
  const rows = text.split(/\r?\n/).map((line) => {
    const values = [];
    let current = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"' && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  });

  const headers = rows.shift().map((header) => header.trim());
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [
    header,
    (row[index] || "").trim()
  ])));
}

function requireColumns(rows, columns, fileName) {
  const first = rows[0] || {};
  const missing = columns.filter((column) => !(column in first));
  if (missing.length) {
    throw new Error(`${fileName} is missing columns: ${missing.join(", ")}`);
  }
}

function bandForPpm(ppm) {
  if (ppm <= 60) return "Soft";
  if (ppm <= 120) return "Moderately hard";
  if (ppm <= 180) return "Hard";
  return "Very hard";
}

function bandDistribution(zips) {
  return Object.values(zips).reduce((counts, record) => {
    counts[record.band] = (counts[record.band] || 0) + 1;
    return counts;
  }, {});
}

function writeQaReport(lookup, details = {}) {
  const zips = lookup.zips || {};
  const estimatedPrefixes = lookup.estimated_prefixes || {};
  const report = {
    generated_at: new Date().toISOString(),
    coverage: lookup.meta && lookup.meta.coverage ? lookup.meta.coverage : "unknown",
    zip_count: Object.keys(zips).length,
    band_distribution: bandDistribution(zips),
    estimated_prefix_count: Object.keys(estimatedPrefixes).length,
    missing_or_unsupported_zip_count: details.missing_or_unsupported_zip_count || 0,
    source_files: details.source_files || [],
    notes: details.notes || []
  };

  fs.writeFileSync(qaReportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, qaReportPath)}`);
}

function countyKey(row) {
  return `${row.state_fips}-${row.county_fips}`;
}

function writeLookup(lookup, details = {}) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const json = args.has("--pretty")
    ? JSON.stringify(lookup, null, 2)
    : JSON.stringify(lookup);
  fs.writeFileSync(outputPath, `${json}\n`);
  console.log(`Wrote ${path.relative(root, outputPath)}`);
  writeQaReport(lookup, details);
}

function buildSample() {
  const lookup = args.has("--include-qa")
    ? {
        ...SAMPLE_LOOKUP,
        meta: {
          ...SAMPLE_LOOKUP.meta,
          coverage: "seed-plus-qa",
          note: "Seed dataset with QA-only marker stress ZIP included."
        },
        zips: {
          ...SAMPLE_LOOKUP.zips,
          ...QA_ONLY_LOOKUP.zips
        }
      }
    : SAMPLE_LOOKUP;

  writeLookup(lookup, {
    notes: [
      "Seed output is not national coverage.",
      "QA-only records are excluded unless --include-qa is passed."
    ],
    source_files: [
      {
        label: "USGS hardness classification",
        url: "https://www.usgs.gov/special-topics/water-science-school/science/hardness-water"
      }
    ]
  });
}

function buildFromRaw() {
  const usgsPath = path.join(rawDir, "usgs-county-hardness.csv");
  const crosswalkPath = path.join(rawDir, "hud-usps-zip-county.csv");
  const overridesPath = path.join(rawDir, "utility-overrides.csv");
  const estimatedPrefixesPath = path.join(rawDir, "estimated-prefixes.csv");

  for (const requiredPath of [usgsPath, crosswalkPath]) {
    if (!fs.existsSync(requiredPath)) {
      throw new Error(`Missing ${path.relative(root, requiredPath)}. See data/raw/README.md.`);
    }
  }

  const usgsRows = parseCsv(usgsPath);
  const crosswalkRows = parseCsv(crosswalkPath);
  const overrideRows = fs.existsSync(overridesPath) ? parseCsv(overridesPath) : [];
  const estimatedPrefixRows = fs.existsSync(estimatedPrefixesPath) ? parseCsv(estimatedPrefixesPath) : [];

  requireColumns(usgsRows, ["state_fips", "county_fips", "state", "county", "ppm", "source_label", "source_url"], "usgs-county-hardness.csv");
  requireColumns(crosswalkRows, ["zip", "state_fips", "county_fips", "res_ratio"], "hud-usps-zip-county.csv");
  if (overrideRows.length) {
    requireColumns(overrideRows, ["zip", "ppm", "city_or_county", "source_label", "source_url"], "utility-overrides.csv");
  }
  if (estimatedPrefixRows.length) {
    requireColumns(estimatedPrefixRows, ["prefix", "ppm", "city_or_county", "source_label", "source_url"], "estimated-prefixes.csv");
  }

  const countyHardness = new Map(usgsRows.map((row) => [countyKey(row), row]));
  const bestCountyByZip = new Map();

  for (const row of crosswalkRows) {
    const current = bestCountyByZip.get(row.zip);
    if (!current || Number(row.res_ratio) > Number(current.res_ratio)) {
      bestCountyByZip.set(row.zip, row);
    }
  }

  const zips = {};
  let missingCount = 0;
  for (const [zip, crosswalk] of bestCountyByZip.entries()) {
    const county = countyHardness.get(countyKey(crosswalk));
    if (!county) {
      missingCount += 1;
      continue;
    }
    const ppm = Math.round(Number(county.ppm));
    zips[zip] = {
      zip,
      ppm,
      band: bandForPpm(ppm),
      city_or_county: `${county.county}, ${county.state}`,
      source_label: county.source_label,
      source_url: county.source_url
    };
  }

  for (const row of overrideRows) {
    const ppm = Math.round(Number(row.ppm));
    zips[row.zip] = {
      zip: row.zip,
      ppm,
      band: bandForPpm(ppm),
      city_or_county: row.city_or_county,
      source_label: row.source_label,
      source_url: row.source_url
    };
  }

  const estimated_prefixes = {};
  for (const row of estimatedPrefixRows) {
    const ppm = Math.round(Number(row.ppm));
    estimated_prefixes[row.prefix] = {
      ppm,
      band: bandForPpm(ppm),
      city_or_county: row.city_or_county,
      source_label: row.source_label,
      source_url: row.source_url,
      estimated: true
    };
  }

  writeLookup({
    meta: {
      version: `generated-${new Date().toISOString()}`,
      generated_at: new Date().toISOString(),
      coverage: "generated",
      source_basis: [
        "USGS hardness category definitions",
        "HUD-USPS ZIP-county crosswalk residential ratios",
        "Normalized official county/utility hardness records"
      ],
      note: "Generated from local official raw files and optional utility overrides."
    },
    zips,
    estimated_prefixes
  }, {
    missing_or_unsupported_zip_count: missingCount,
    source_files: [
      fileStats(usgsPath, "Normalized official county hardness input"),
      fileStats(crosswalkPath, "HUD-USPS ZIP-county crosswalk input"),
      fs.existsSync(overridesPath) ? fileStats(overridesPath, "Utility override input") : null,
      fs.existsSync(estimatedPrefixesPath) ? fileStats(estimatedPrefixesPath, "Estimated prefix input") : null
    ].filter(Boolean),
    notes: [
      "Each ZIP uses the county with the highest residential ratio unless a utility override exists.",
      "Utility overrides win over county-level values.",
      "Estimates are emitted only from explicit estimated-prefixes.csv rows."
    ]
  });
}

function fileStats(filePath, label) {
  const stats = fs.statSync(filePath);
  return {
    label,
    path: path.relative(root, filePath),
    bytes: stats.size,
    modified_at: stats.mtime.toISOString()
  };
}

if (args.has("--sample")) {
  buildSample();
} else {
  buildFromRaw();
}
