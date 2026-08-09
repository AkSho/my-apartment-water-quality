# Water Hardness Dataset Expansion: Wave 1 Findings

**Date**: 2026-08-09
**Status**: Wave 1 — 15 verified, 4 pending, 1 no-public-number

## Coverage

| Category | Count |
|----------|-------|
| Target systems (wave 1) | 20 |
| Verified (hardness value from primary source) | 15 |
| No public number | 1 (Miami-Dade) |
| Pending manual PDF review | 4 (Tucson, SLC, Lubbock, OKC) |

## Verified records

| City | Utility | Hardness (ppm) | Range | Band | Source type |
|------|---------|---------------|-------|------|------------|
| Indianapolis, IN | Citizens Water | 317 avg | 148-460 | Very hard | Quality page |
| San Antonio, TX | SAWS | 299 (midpoint) | 257-342 (15-20 gpg) | Very hard | FAQ page |
| Las Vegas, NV | LVVWD | 280 | single value | Very hard | CCR PDF |
| San Diego, CA | San Diego PUD | 276 | 276-308 (16-18 gpg) | Very hard | Quality page |
| Phoenix, AZ | Phoenix Water | 237 (midpoint) | 172-302 | Hard to Very hard | WQ Report PDF |
| Tampa, FL | Tampa Water | 185 avg | 140-300 | Very hard | CCR PDF + FAQ |
| El Paso, TX | El Paso Water | 175 avg | single value | Hard | Chem analysis PDF |
| Wichita, KS | Wichita Water | 170 | single value | Hard | CCR PDF |
| Dayton, OH | City of Dayton | 155 (treated) | raw: 320 | Hard | FAQ page |
| Chicago, IL | Chicago DWM | 139 (midpoint) | 133-145 | Hard | CCA series |
| Louisville, KY | Louisville Water | 128 | single value | Hard | CCR PDF |
| Austin, TX | Austin Water | 93 avg | 70-126 | Moderately hard | CCR inline HTML |
| Denver, CO | Denver Water | 89 avg | 48-116 | Moderately hard | CCR PDF |
| New York, NY | NYC DEP | 25 avg | 16-90 | Soft | CCR PDF |
| Portland, OR | Portland Water Bureau | 9 (midpoint) | 7-11 | Soft | Quality report page |

## Re-verification of existing 4 records

| City | Old value | New value | Status |
|------|-----------|-----------|--------|
| Austin, TX | 93 ppm | 93 ppm | CONFIRMED |
| Las Vegas, NV | 280 ppm | 280 ppm | CONFIRMED |
| Portland, OR | 7 ppm | 7-11 ppm (midpoint 9) | DISCREPANCY: old record used range minimum. Live report still shows 7; needs update. |
| Chicago, IL | 148 ppm | 133-145 ppm (CCA series) | DISCREPANCY: old value 148 is close but above verified range. CCR omits hardness; CCA is the correct source. FLAGGED for year-refresh (2012 data verified; 2024 files exist). |

## Spot-check results

### Wave 1 original (5 of 12)
| Record | Re-fetched value | Match |
|--------|-----------------|-------|
| SAWS (FAQ) | 15-20 gpg | PASS |
| Indianapolis (quality page) | 317 ppm / 19 gpg | PASS |
| San Diego (quality page) | 276 ppm / 16 gpg | PASS |
| Tampa (FAQ) | 140-300 ppm | PASS |
| Dayton (FAQ) | 155 mg/L / 9 gpg | PASS |

### Manual-pass records (verified by owner Aug 9)
| Record | Source | Verification |
|--------|--------|-------------|
| Phoenix (WQ Report PDF) | phoenix.gov primary WQ report | Owner verified from PDF aesthetic table |
| Chicago (CCA series) | chicago.gov CCA quarterly series | Owner verified from 2012 file; Lake Michigan hardness stable |
| El Paso (chem analysis) | epwater.org/ep-water/uploads/chemanalysis.pdf | Automated extraction confirmed 175 mg/L / 10.2 gpg |

## URL rot log

Of ~35+ URLs attempted across both automated and manual passes:
- **~80% of guessed CCR PDF URLs were 404** — stale or incorrectly guessed paths
- **WebSearch discovery resolved most** — search finds the live URL that guessing misses
- **"Image-based PDF" diagnosis was wrong** for Phoenix — the failure was URL rot, not scan-only files
- **Chicago CCR omits hardness entirely** — the CCA series (quarterly chemical analysis) is the correct source. Same CCR-omission pattern as Miami-Dade.
- **OKC PDFs redirect to HTML** — their file server blocks direct downloads

For maintenance: re-run discovery annually after CCR publication season (typically May-July). Never trust cached PDF URLs.

## Systems pending manual review (4)

| City | Utility | What to do |
|------|---------|-----------|
| Tucson, AZ | Tucson Water | Pull numbers from annual WQ report BY SERVICE AREA (not citywide). Groundwater vs CAP blend varies. Store per-area values or full range. |
| Salt Lake City, UT | SLC DPU | Artesian well data shows 535 ppm but that's a single well. Download current CCR from slc.gov (PDF redirects failed; try browser). |
| Lubbock, TX | City of Lubbock | Site migrated from ci.lubbock.tx.us to mylubbock.us; CCR PDFs redirect. Try browser download. Search snippets suggest 169 ppm avg. |
| Oklahoma City, OK | OKC Utilities | PDF downloads redirect to HTML. Try browser at okc.gov/ccr. |

## No-public-number systems (1)

| City | Utility | Notes |
|------|---------|-------|
| Miami, FL | Miami-Dade WASD | Multiple CCR years checked (2020, 2022, 2024). All mention lime softening but publish no hardness number. Non-CCR publications (engineering docs, master plans) not yet checked. |

## Hardest-25 ranking (draft, 15 sourced records)

| Rank | City | ppm | Band | Source |
|------|------|-----|------|--------|
| 1 | Indianapolis, IN | 317 avg | Very hard | Citizens Water quality page |
| 2 | San Antonio, TX | 299 (midpoint) | Very hard | SAWS FAQ |
| 3 | Las Vegas, NV | 280 | Very hard | LVVWD CCR PDF |
| 4 | San Diego, CA | 276 | Very hard | San Diego PUD quality page |
| 5 | Phoenix, AZ | 237 (midpoint) | Hard to Very hard | WQ Report PDF |
| 6 | Tampa, FL | 185 avg | Very hard | CCR PDF |
| 7 | El Paso, TX | 175 avg | Hard (edge) | Chem analysis PDF |
| 8 | Wichita, KS | 170 | Hard (edge) | CCR PDF |
| 9 | Dayton, OH | 155 (treated) | Hard | FAQ page |
| 10 | Chicago, IL | 139 (midpoint) | Hard | CCA series |
| 11 | Louisville, KY | 128 | Hard | CCR PDF |
| 12 | Austin, TX | 93 avg | Moderately hard | CCR inline |
| 13 | Denver, CO | 89 avg | Moderately hard | CCR PDF |
| 14 | New York, NY | 25 avg | Soft | CCR PDF |
| 15 | Portland, OR | 9 (midpoint) | Soft | Quality report page |

Remaining 10 positions pending: Tucson, SLC, Lubbock, OKC (4 pending review), plus wave 2 metros.

## City vs zip recommendation (unchanged)

**City/system as primary, zips as lookup index.** See `docs/report-url-migration-plan.md` for full rationale.

## Next steps

1. **Manual extraction** for 4 remaining systems (Tucson, SLC, Lubbock, OKC)
2. **Portland record update**: 7→9 ppm with range 7-11 (live report shows old value)
3. **Chicago year-refresh**: cite 2024 CCA file instead of 2012
4. **Wave 2**: expand to remaining metros, including Greene County (Beavercreek) for Dayton metro, hard-water-belt states prioritized
5. **Zip mapping** via EPA SDWIS service area data
