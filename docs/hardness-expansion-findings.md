# Water Hardness Dataset Expansion: Wave 1 Findings

**Date**: 2026-08-08
**Status**: Wave 1 in progress — 12 verified, 8 pending manual review

## Coverage

| Category | Count |
|----------|-------|
| Target systems (wave 1) | 20 |
| Verified (hardness value from primary source) | 12 |
| No public number (CCR exists but no hardness figure) | 1 (Miami-Dade) |
| Pending manual PDF review | 7 |

## Verified records

| City | Utility | Hardness (ppm) | Range | Band | Source type |
|------|---------|---------------|-------|------|------------|
| San Antonio, TX | SAWS | 299 (midpoint) | 257-342 (15-20 gpg) | Very hard | FAQ page |
| Indianapolis, IN | Citizens Water | 317 avg | 148-460 | Very hard | Quality page |
| Las Vegas, NV | LVVWD | 280 | single value | Very hard | CCR PDF |
| San Diego, CA | San Diego PUD | 276 | 276-308 (16-18 gpg) | Very hard | Quality page |
| Tampa, FL | Tampa Water | 185 avg | 140-300 | Very hard | CCR PDF + FAQ |
| Wichita, KS | Wichita Water | 170 | single value | Hard | CCR PDF |
| Dayton, OH | City of Dayton | 155 (treated) | raw: 320 | Hard | FAQ page |
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
| Portland, OR | 7 ppm | 7-11 ppm (midpoint 9) | DISCREPANCY: old record used range minimum. Update to 9 ppm with range. |
| Chicago, IL | 148 ppm | Not yet verified | CCR PDF has image-based tables. Manual review pending. |

## Spot-check results (5 of 12 re-verified)

| Record | Re-fetched value | Match |
|--------|-----------------|-------|
| SAWS (FAQ) | 15-20 gpg | PASS |
| Indianapolis (quality page) | 317 ppm / 19 gpg | PASS |
| San Diego (quality page) | 276 ppm / 16 gpg | PASS (updated from 274 to match utility's stated ppm) |
| Tampa (FAQ) | 140-300 ppm | PASS |
| Dayton (FAQ) | 155 mg/L / 9 gpg | PASS |

## URL rot log

Of ~35 guessed CCR PDF URLs attempted:
- **~28 (80%) returned 404** — stale or incorrectly guessed paths
- **~4 returned valid PDFs** from guessed patterns (NYC, Louisville, Tampa, Wichita)
- **~3 returned HTML error pages** masquerading as PDFs (Chicago non-CCR, Lubbock, El Paso)

WebSearch discovery found live URLs for most systems. The lesson: utility PDF paths are not predictable year-to-year; discovery must precede fetch.

For maintenance: re-run discovery annually after CCR publication season (typically May-July).

## Systems pending manual review (7)

| City | Utility | What to do |
|------|---------|-----------|
| Chicago, IL | Chicago DWM | Open 2024 CCR PDF (55MB) at chicago.gov; Ctrl+F "hardness" in data table. Image-based tables prevented automated extraction. |
| Phoenix, AZ | Phoenix Water Services | Open taste/odor/hardness FAQ PDF at phoenix.gov/waterservicessite/documents/taste_odor_and_hardnessfaqs.pdf or the annual Water Quality Report. |
| Tucson, AZ | Tucson Water | Open 2024 CCR at tucsonaz.gov. Known hard to very hard. |
| Salt Lake City, UT | SLC DPU | Open 2026 CCR at slc.gov. Well water at 535 ppm but need system-wide number. |
| Lubbock, TX | City of Lubbock | Open CCR at ci.lubbock.tx.us. Search snippets suggest 169 ppm avg but unverified. |
| El Paso, TX | El Paso Water | Open Drinking Water Report at epwater.org. FAQ says "moderately hard to hard." |
| Oklahoma City, OK | OKC Utilities | Open CCR at okc.gov/ccr. |

## No-public-number systems (1)

| City | Utility | Notes |
|------|---------|-------|
| Miami, FL | Miami-Dade WASD | CCR mentions lime treatment to reduce hardness but publishes no hardness number. Upgrade if a utility FAQ page with the number surfaces. |

## Preliminary hardest-25 ranking (sourced records only)

| Rank | City | ppm | Band | Source |
|------|------|-----|------|--------|
| 1 | San Antonio, TX | 299 (midpoint 15-20 gpg) | Very hard | SAWS FAQ |
| 2 | Indianapolis, IN | 317 avg | Very hard | Citizens Water quality page |
| 3 | Las Vegas, NV | 280 | Very hard | LVVWD CCR PDF |
| 4 | San Diego, CA | 276 | Very hard | San Diego PUD quality page |
| 5 | Tampa, FL | 185 avg | Very hard | Tampa CCR PDF |
| 6 | Wichita, KS | 170 | Hard | Wichita CCR PDF |
| 7 | Dayton, OH | 155 (treated) | Hard | Dayton FAQ |
| 8 | Louisville, KY | 128 | Hard | Louisville CCR PDF |

Remaining 17 positions pending data from Phoenix, Tucson, SLC, Lubbock, El Paso, OKC, and wave 2 metros.

## City vs zip recommendation (unchanged from initial memo)

**City/system as primary, zips as lookup index.** The data confirms: utilities publish one number per system serving dozens of zips. See initial memo for full rationale.

## Next steps

1. **Manual extraction** for the 7 pending systems (owner task: ~30 min total)
2. **Chicago re-verification** (determines whether existing 148 ppm record needs updating)
3. **Portland record update**: change from 7 ppm to 9 ppm with range 7-11 (live report still shows old value)
4. **Wave 2**: remaining metros from the original 50 list + additional known-hard metros
5. **Zip mapping** via EPA SDWIS service area data (after 50+ verified records)
