# Water Hardness Dataset Expansion: Wave 1 Findings

**Date**: 2026-08-06
**Status**: Partial — infrastructure delivered, manual data extraction required

## Coverage

| Category | Count |
|----------|-------|
| Target systems (wave 1) | 50 |
| Verified from web (hardness value confirmed) | 2 |
| Existing records pending re-verification | 3 (Chicago, Las Vegas, Portland) |
| Existing records re-verified | 1 (Austin: 93 ppm confirmed) |
| Awaiting manual PDF extraction | 44 |

## Verified records

| City | Utility | Hardness (ppm) | Band | Source |
|------|---------|---------------|------|--------|
| Austin, TX | Austin Water | 93 avg (70-126 range) | Moderately hard | 2025 CCR, austintexas.gov |
| San Diego, CA | San Diego PUD | 274 (16 gpg avg, range 16-18 gpg) | Very hard | sandiego.gov/public-utilities |

## Existing records requiring re-verification

| City | Current value | Status | Action |
|------|--------------|--------|--------|
| Chicago, IL | 148 ppm | CCR landing page accessible; data in PDF | Open PDF from chicago.gov CCR page |
| Las Vegas, NV | 280 ppm | CCR landing page accessible; data in linked reports | Open reports from lvvwd.com |
| Portland, OR | 7 ppm | CCR page returned 404 | Try portland.gov/water direct or Google "Portland Water Bureau CCR 2025" |

## Why automated extraction failed

Most US water utilities publish hardness data exclusively in PDF Consumer Confidence Reports. Of 30+ URLs attempted:

- **~20 returned 403/404/SSL errors** (municipal sites blocking automated requests or broken URLs)
- **~8 returned landing pages** that link to PDF CCRs but don't contain hardness data inline
- **2 returned usable inline data** (Austin, San Diego)
- **0 PDF CCRs could be read** (WebFetch cannot process PDFs)

This is not a tooling bug — it's how the industry works. CCRs are annual PDF documents mailed to customers and posted online as PDF downloads.

## Source URL inventory for manual extraction

The fastest path: open each URL below in a browser, find the most recent CCR (usually a PDF link), Ctrl+F for "hardness" or "hard" in the PDF, and record the value.

### Priority 1: Known hard/very hard metros (highest value for the product)

| City | Utility | CCR URL | Expected band |
|------|---------|---------|--------------|
| Phoenix, AZ | City of Phoenix Water Services | phoenix.gov/waterservices/water-quality | Very hard |
| San Antonio, TX | SAWS | saws.org/your-water/water-quality/water-quality-report/ | Very hard |
| Tucson, AZ | Tucson Water | tucsonaz.gov/water/water-quality | Very hard |
| Indianapolis, IN | Citizens Energy Group | citizensenergygroup.com/Water-Quality | Very hard |
| Las Vegas, NV | LVVWD | lvvwd.com/water-quality/reports/ | Very hard (verify 280) |
| Salt Lake City, UT | SLC DPU | slc.gov/utilities/water-quality/ | Hard/Very hard |
| Dayton, OH | City of Dayton | daytonohio.gov/259/Water-Quality-Reports | Very hard |
| Lubbock, TX | City of Lubbock | mylubbock.us/water | Very hard |
| El Paso, TX | El Paso Water | epwater.org/our-water/water-quality | Very hard |
| Wichita, KS | City of Wichita | wichita.gov/PublicWorks/WaterUtilities | Very hard |
| Tampa, FL | City of Tampa | tampa.gov/water/water-quality | Hard |
| Miami, FL | Miami-Dade WASD | miamidade.gov/water/water-quality.asp | Hard |
| Dallas, TX | Dallas Water Utilities | dallascityhall.com/departments/waterutilities | Hard |
| Houston, TX | City of Houston | houstontx.gov/water/waterquality.html | Hard |
| Bakersfield, CA | Cal Water | calwater.com/water-quality/ | Hard |
| Fresno, CA | City of Fresno | fresno.gov/publicutilities/water-quality/ | Hard |

### Priority 2: Large metros (coverage completeness)

| City | Utility | CCR URL |
|------|---------|---------|
| New York, NY | NYC DEP | nyc.gov/site/dep/water/drinking-water-quality-report.page |
| Los Angeles, CA | LADWP | ladwp.com/water-quality |
| Chicago, IL | Chicago DWM | chicago.gov/city/en/depts/water/supp_info/water_quality_resultsandreports.html |
| Washington, DC | DC Water | dcwater.com/water-quality |
| Philadelphia, PA | Philadelphia Water | water.phila.gov/pool/files/annual-report.pdf |
| Atlanta, GA | Atlanta Watershed | atlantawatershed.org/drinking-water/water-quality-report/ |
| Boston, MA | MWRA | mwra.com/water/html/awqr.htm |
| San Francisco, CA | SFPUC | sfpuc.gov/drinking-water/water-quality |
| Riverside, CA | Riverside PU | riversideca.gov/utilities/water-quality |
| Detroit, MI | GLWA | glwater.org/water-quality/ |
| Seattle, WA | Seattle PU | seattle.gov/utilities/your-services/water/water-quality |
| Minneapolis, MN | Minneapolis Water | minneapolismn.gov/government/departments/public-works/water-treatment/ |
| Denver, CO | Denver Water | denverwater.org/your-water/water-quality |
| St. Louis, MO | City of St. Louis | stlwater.com/water-quality/ |
| Baltimore, MD | Baltimore DPW | publicworks.baltimorecity.gov/water-quality |
| Orlando, FL | OUC | ouc.com/water-quality |
| Charlotte, NC | Charlotte Water | charlottenc.gov/Water/WaterQuality/ |
| Portland, OR | Portland Water Bureau | portland.gov/water/water-quality/water-quality-reports |
| Columbus, OH | Columbus Div. of Water | columbus.gov/utilities/water-quality/ |
| Nashville, TN | Metro Water Services | nashville.gov/departments/water-services/water-quality |
| Jacksonville, FL | JEA | jea.com/water-quality |
| Sacramento, CA | City of Sacramento | cityofsacramento.gov/utilities/water/water-quality |
| Kansas City, MO | KC Water | kcwater.us/water-quality/ |
| Cincinnati, OH | GCWW | cincinnati-oh.gov/water/water-quality/ |
| Milwaukee, WI | Milwaukee Water Works | city.milwaukee.gov/water/WaterQuality |
| Raleigh, NC | City of Raleigh | raleighnc.gov/water-and-sewer/water-quality |
| Pittsburgh, PA | PWSA | pgh2o.com/water-quality |
| Cleveland, OH | Cleveland Water | clevelandwater.com/water-quality |
| Oklahoma City, OK | OKC Utilities | okc.gov/departments/utilities/water-quality |
| Louisville, KY | Louisville Water | louisvillewater.com/water-quality (PDF: LW-CCR-2025-Report-Final.pdf) |
| Memphis, TN | MLGW | mlgw.com/residential/waterquality |

## Schema

Records stored in `data/metro-hardness.json`. Schema per system:

```
system_id, utility_name, city, state, metro,
zips_served[], hardness_value_original, unit_original,
hardness_ppm (or ppm_min/ppm_max for ranges),
band, band_note, source_url, source_year,
retrieved_date, confidence, notes
```

Band assignment: midpoint for ranges; flagged when midpoint is within 10 ppm of a band boundary or range spans bands.

## Preliminary recommendation: city vs zip as programmatic unit

**Recommendation: city/system as primary, zips as lookup index.**

Rationale from what the data actually shows:
1. Most utilities serve dozens of zips but publish one hardness number per system. The natural content unit is the system, not the zip.
2. Many zips are served by multiple systems (especially in metro fringes). Assigning a single number per zip requires dominance logic that adds fragility.
3. A `/water-hardness/phoenix-az` page with "Phoenix Water Services reports 285 ppm" is a stronger, more citable page than `/report/85001` with the same number.
4. Zip lookup remains valuable as a routing layer: user enters zip → we map it to the serving system → we show the system-level page or data.

The schema supports both: `zips_served[]` on each system record enables zip-to-system lookup, while the system is the entity with the sourced hardness number.

**Hold the URL strategy decision** until the dataset has 50+ verified records — the zip-mapping quality will determine whether zip-level pages add value or just create near-duplicates.

## Hardest-25 metros (draft, from 2 verified + known-hard expectations)

Cannot produce a sourced ranking from only 2 verified records. Once manual extraction fills in the priority-1 metros above, the ranking will populate naturally from the dataset. The expected top contenders based on USGS regional data and utility reputation:

1. Las Vegas, NV (existing record: 280 ppm, pending re-verification)
2. San Diego, CA (verified: 274 ppm)
3. Phoenix, AZ (expected >250 ppm)
4. Tucson, AZ (expected >200 ppm)
5. San Antonio, TX (expected >200 ppm, Edwards Aquifer limestone)
6. Indianapolis, IN (expected >200 ppm)
7. Lubbock, TX (expected >200 ppm, Ogallala Aquifer)
8. El Paso, TX (expected >200 ppm)
9. Wichita, KS (expected >200 ppm)
10. Dayton, OH (expected >200 ppm, Great Miami Aquifer)

Remaining 15 positions pending data. These "expected" values are directional from USGS geology — they must be replaced with utility CCR numbers before publication.

## Next steps

1. **Manual extraction** (owner task): open priority-1 CCR PDFs, extract hardness values, add to `data/metro-hardness.json` verified records
2. **Spot-check**: after 50 records filled, re-open 10 random source URLs and confirm match
3. **Zip mapping**: use EPA SDWIS service area data to populate `zips_served[]` for verified records
4. **Wave 2**: expand to remaining metros (100-150 more systems)
5. **Integration**: update `hardness-lookup.json` with verified records (separate task, after dataset is reviewed)
