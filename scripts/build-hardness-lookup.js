#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rawDir = path.join(root, "data", "raw");
const outputPath = path.join(root, "data", "hardness-lookup.json");
const qaReportPath = path.join(root, "data", "hardness-build-report.json");
const args = new Set(process.argv.slice(2));

const USGS_HARDNESS_SOURCE = {
  label: "USGS hardness classification and national hardness map",
  url: "https://www.usgs.gov/special-topics/water-science-school/science/hardness-water"
};

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
      source_label: "Estimated from ZIP-prefix data",
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

const NATIONAL_PREFIX_ESTIMATES = [
  ["01", 65, "Massachusetts ZIP-prefix estimate"],
  ["02", 70, "New England ZIP-prefix estimate"],
  ["03", 35, "New Hampshire/Vermont ZIP-prefix estimate"],
  ["04", 35, "Maine ZIP-prefix estimate"],
  ["05", 35, "Vermont ZIP-prefix estimate"],
  ["06", 75, "Connecticut ZIP-prefix estimate"],
  ["07", 110, "New Jersey ZIP-prefix estimate"],
  ["08", 110, "New Jersey ZIP-prefix estimate"],
  ["09", 120, "USPS 09 ZIP-prefix region estimate"],
  ["10", 95, "New York ZIP-prefix estimate"],
  ["11", 95, "New York ZIP-prefix estimate"],
  ["12", 95, "New York ZIP-prefix estimate"],
  ["13", 115, "New York ZIP-prefix estimate"],
  ["14", 120, "New York ZIP-prefix estimate"],
  ["15", 150, "Pennsylvania ZIP-prefix estimate"],
  ["16", 150, "Pennsylvania ZIP-prefix estimate"],
  ["17", 140, "Pennsylvania ZIP-prefix estimate"],
  ["18", 145, "Pennsylvania ZIP-prefix estimate"],
  ["19", 140, "Pennsylvania/Delaware ZIP-prefix estimate"],
  ["20", 115, "DC/Maryland/Virginia ZIP-prefix estimate"],
  ["21", 115, "Maryland ZIP-prefix estimate"],
  ["22", 115, "Virginia ZIP-prefix estimate"],
  ["23", 105, "Virginia ZIP-prefix estimate"],
  ["24", 105, "Virginia ZIP-prefix estimate"],
  ["25", 95, "West Virginia ZIP-prefix estimate"],
  ["26", 95, "West Virginia ZIP-prefix estimate"],
  ["27", 55, "North Carolina ZIP-prefix estimate"],
  ["28", 55, "North Carolina ZIP-prefix estimate"],
  ["29", 50, "South Carolina ZIP-prefix estimate"],
  ["30", 65, "Georgia ZIP-prefix estimate"],
  ["31", 70, "Georgia ZIP-prefix estimate"],
  ["32", 150, "Florida ZIP-prefix estimate"],
  ["33", 150, "Florida ZIP-prefix estimate"],
  ["34", 150, "Florida ZIP-prefix estimate"],
  ["35", 70, "Alabama ZIP-prefix estimate"],
  ["36", 70, "Alabama ZIP-prefix estimate"],
  ["37", 95, "Tennessee ZIP-prefix estimate"],
  ["38", 95, "Tennessee/Mississippi ZIP-prefix estimate"],
  ["39", 60, "Mississippi ZIP-prefix estimate"],
  ["40", 160, "Kentucky ZIP-prefix estimate"],
  ["41", 160, "Kentucky ZIP-prefix estimate"],
  ["42", 160, "Kentucky ZIP-prefix estimate"],
  ["43", 175, "Ohio ZIP-prefix estimate"],
  ["44", 175, "Ohio ZIP-prefix estimate"],
  ["45", 175, "Ohio ZIP-prefix estimate"],
  ["46", 180, "Indiana ZIP-prefix estimate"],
  ["47", 180, "Indiana ZIP-prefix estimate"],
  ["48", 170, "Michigan ZIP-prefix estimate"],
  ["49", 170, "Michigan ZIP-prefix estimate"],
  ["50", 230, "Iowa ZIP-prefix estimate"],
  ["51", 230, "Iowa ZIP-prefix estimate"],
  ["52", 230, "Iowa ZIP-prefix estimate"],
  ["53", 180, "Wisconsin ZIP-prefix estimate"],
  ["54", 180, "Wisconsin ZIP-prefix estimate"],
  ["55", 180, "Minnesota ZIP-prefix estimate"],
  ["56", 180, "Minnesota ZIP-prefix estimate"],
  ["57", 260, "South Dakota ZIP-prefix estimate"],
  ["58", 240, "North Dakota ZIP-prefix estimate"],
  ["59", 180, "Montana ZIP-prefix estimate"],
  ["60", 180, "Illinois ZIP-prefix estimate"],
  ["61", 180, "Illinois ZIP-prefix estimate"],
  ["62", 180, "Illinois ZIP-prefix estimate"],
  ["63", 160, "Missouri ZIP-prefix estimate"],
  ["64", 160, "Missouri ZIP-prefix estimate"],
  ["65", 160, "Missouri ZIP-prefix estimate"],
  ["66", 220, "Kansas ZIP-prefix estimate"],
  ["67", 220, "Kansas ZIP-prefix estimate"],
  ["68", 250, "Nebraska ZIP-prefix estimate"],
  ["69", 250, "Nebraska ZIP-prefix estimate"],
  ["70", 130, "Louisiana ZIP-prefix estimate"],
  ["71", 130, "Louisiana ZIP-prefix estimate"],
  ["72", 85, "Arkansas ZIP-prefix estimate"],
  ["73", 210, "Oklahoma ZIP-prefix estimate"],
  ["74", 210, "Oklahoma ZIP-prefix estimate"],
  ["75", 200, "Texas ZIP-prefix estimate"],
  ["76", 200, "Texas ZIP-prefix estimate"],
  ["77", 190, "Texas ZIP-prefix estimate"],
  ["78", 210, "Texas ZIP-prefix estimate"],
  ["79", 210, "Texas ZIP-prefix estimate"],
  ["80", 170, "Colorado ZIP-prefix estimate"],
  ["81", 170, "Colorado ZIP-prefix estimate"],
  ["82", 200, "Wyoming ZIP-prefix estimate"],
  ["83", 180, "Idaho ZIP-prefix estimate"],
  ["84", 250, "Utah ZIP-prefix estimate"],
  ["85", 300, "Arizona ZIP-prefix estimate"],
  ["86", 300, "Arizona ZIP-prefix estimate"],
  ["87", 220, "New Mexico ZIP-prefix estimate"],
  ["88", 220, "New Mexico/Texas ZIP-prefix estimate"],
  ["89", 280, "Nevada ZIP-prefix estimate"],
  ["90", 160, "California ZIP-prefix estimate"],
  ["91", 160, "California ZIP-prefix estimate"],
  ["92", 170, "California ZIP-prefix estimate"],
  ["93", 180, "California ZIP-prefix estimate"],
  ["94", 120, "California ZIP-prefix estimate"],
  ["95", 150, "California ZIP-prefix estimate"],
  ["96", 120, "California ZIP-prefix estimate"],
  ["97", 35, "Oregon ZIP-prefix estimate"],
  ["98", 30, "Washington ZIP-prefix estimate"],
  ["99", 60, "Alaska ZIP-prefix estimate"]
];

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

function nationalEstimatedPrefixes() {
  return Object.fromEntries(NATIONAL_PREFIX_ESTIMATES.map(([prefix, ppm, cityOrCounty]) => [
    prefix,
    {
      ppm,
      band: bandForPpm(ppm),
      city_or_county: cityOrCounty,
      source_label: "Estimated from ZIP-prefix data",
      source_url: USGS_HARDNESS_SOURCE.url,
      estimated: true
    }
  ]));
}

function buildNationalEstimates() {
  const lookup = {
    meta: {
      version: `national-estimates-${new Date().toISOString()}`,
      generated_at: new Date().toISOString(),
      coverage: "national-estimated",
      source_basis: [
        "USGS hardness category definitions and national hardness map",
        "USPS ZIP-prefix geography for state/region fallback estimates",
        "Official utility water quality reports for exact seed ZIPs"
      ],
      note: "National launch dataset. Exact utility records are used where present; other valid ZIPs fall back to clearly labeled ZIP-prefix estimates."
    },
    zips: SAMPLE_LOOKUP.zips,
    estimated_prefixes: nationalEstimatedPrefixes()
  };

  writeLookup(lookup, {
    missing_or_unsupported_zip_count: 0,
    source_files: [
      {
        ...USGS_HARDNESS_SOURCE,
        type: "official_public_web_source"
      },
      {
        label: "USPS ZIP-prefix geography",
        url: "https://postalpro.usps.com/ZIP_Locale_Detail",
        type: "public_reference"
      }
    ],
    notes: [
      "Traffic-ready v1 uses exact utility rows for known seed metros and ZIP-prefix estimates everywhere else.",
      "Every prefix estimate renders with the report's ZIP-prefix estimate label and source line.",
      "HUD-USPS county crosswalk remains the preferred future exact county build input; direct HUD download was blocked by WAF during this pass."
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
} else if (args.has("--national-estimates")) {
  buildNationalEstimates();
} else {
  buildFromRaw();
}
