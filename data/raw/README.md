# Raw Data Inputs

This folder is for local build inputs only. Do not commit full raw source files.

`scripts/build-hardness-lookup.js` expects these files when generating a full lookup:

- `usgs-county-hardness.csv`
  - Required columns: `state_fips`, `county_fips`, `state`, `county`, `ppm`, `source_label`, `source_url`
  - `ppm` is hardness in mg/L as CaCO3.
  - Use official/public hardness records only. Normalize county-level rows here before running the build.
- `hud-usps-zip-county.csv`
  - Required columns: `zip`, `state_fips`, `county_fips`, `res_ratio`
  - Source: HUD-USPS ZIP Code Crosswalk Files.
  - HUD's residential ratio should be used for ZIP-to-county allocation.
  - If multiple counties map to one zip, the highest `res_ratio` row wins.
- `utility-overrides.csv` optional
  - Required columns: `zip`, `ppm`, `city_or_county`, `source_label`, `source_url`
  - Overrides beat county-level USGS rows for the same zip.
- `estimated-prefixes.csv` optional
  - Required columns: `prefix`, `ppm`, `city_or_county`, `source_label`, `source_url`
  - Use only when a broad state/region estimate is acceptable and clearly sourced.
  - These records render as `Estimated from state-level data`.

Generated output:

- `data/hardness-lookup.json`
- `data/hardness-build-report.json`

Band thresholds:

- Soft: `0-60`
- Moderately hard: `61-120`
- Hard: `121-180`
- Very hard: `181+`

For local smoke testing without raw files:

```bash
node scripts/build-hardness-lookup.js --sample
```

That command writes the current small sample-compatible lookup shape.

To include the marker-clipping QA-only ZIP in local testing:

```bash
node scripts/build-hardness-lookup.js --sample --include-qa --pretty
```

To generate production output after official raw files are present:

```bash
node scripts/build-hardness-lookup.js
```

The production command writes minified JSON for browser delivery and a readable
QA report with ZIP count, band distribution, estimate count, missing ZIP count,
and source file modification dates.

Official source pages:

- USGS hardness classification: https://www.usgs.gov/special-topics/water-science-school/science/hardness-water
- HUD-USPS ZIP Code Crosswalk Files: https://www.huduser.gov/portal/datasets/usps_crosswalk.html
