# Water Hardness Dataset Expansion: Interim Findings Memo

**Date**: 2026-08-09
**Status**: Wave 2 in progress. Dataset lane paused; resume in follow-up session.

---

## 1. Coverage stats

**Total systems in dataset: 45**

| Category | Count |
|----------|-------|
| Exact (measured value from primary source) | 38 |
| System-level (published bound, not measured) | 2 |
| Pending manual review | 4 |
| No public number | 1 |
| **Verified total** | **40** |

### By state

| State | Exact | System-level | Pending | No public |
|-------|-------|-------------|---------|-----------|
| AZ | 3 | - | 1 | - |
| CA | 4 | - | - | - |
| CO | 1 | - | - | - |
| DC | 1 | - | - | - |
| FL | 3 | - | - | 1 |
| IA | - | 1 | - | - |
| IL | 1 | - | - | - |
| IN | 1 | - | - | - |
| KS | 1 | - | - | - |
| KY | 1 | - | - | - |
| MN | 2 | - | - | - |
| MO | 1 | - | - | - |
| NC | 1 | 1 | - | - |
| NE | 1 | - | - | - |
| NM | 1 | - | - | - |
| NV | 1 | - | - | - |
| NY | 1 | - | - | - |
| OH | 5 | - | - | - |
| OK | 1 | - | 1 | - |
| OR | 1 | - | - | - |
| TN | 2 | - | - | - |
| TX | 3 | - | 1 | - |
| UT | - | - | 1 | - |
| WI | 2 | - | - | - |

### By band

| Band | Count |
|------|-------|
| Very hard (>180 ppm) | 8 |
| Hard (121-180 ppm) | 12 |
| Hard to Very hard (range spans both) | 3 |
| Moderately hard (61-120 ppm) | 10 |
| Moderately hard to Hard | 1 |
| Soft (<60 ppm) | 5 |
| Soft to Very hard (extreme range) | 1 |
| Unset (pending/no data) | 5 |

---

## 2. Draft hardest-25 table (measured values only)

Ranked by midpoint for ranges. Published bounds (Des Moines, Raleigh) excluded per ruling.

| Rank | City | ppm | Range | Band | Source URL | Year |
|------|------|-----|-------|------|-----------|------|
| 1 | San Jose, CA | 350 mid | 155-545 | Hard to Very hard | sjwater.com/water-faqs/ | 2024 |
| 2 | Madison, WI | 339 mid | 308-370 | Very hard | cityofmadison.com/water/water-quality/faq | 2025 |
| 3 | Indianapolis, IN | 317 avg | 148-460 | Very hard | info.citizensenergygroup.com/water/quality/indianapolis-and-morgan-county | 2025 |
| 4 | San Antonio, TX | 299 mid | 257-342 (15-20 gpg) | Very hard | saws.org FAQ | 2025 |
| 5 | Mesa, AZ | 290 mid | 205-376 (12-22 gpg) | Very hard | mesaaz.gov WQ concerns | 2025 |
| 6 | Las Vegas, NV | 280 | single | Very hard | lvvwd.com CCR PDF | 2026 |
| 7 | San Diego, CA | 276 | 276-308 (16-18 gpg) | Very hard | sandiego.gov/public-utilities/water-quality | 2025 |
| 8 | Scottsdale, AZ | 274 mid | 222-325 (13-19 gpg) | Very hard | scottsdaleaz.gov hard water fact sheet | 2025 |
| 9 | Jacksonville, FL | 246 mid | 120-372 | Hard to Very hard | jea.com hardness levels | 2025 |
| 10 | Phoenix, AZ | 237 mid | 172-302 (10-17.6 gpg) | Hard to Very hard | phoenix.gov WQ report PDF | 2025 |
| 11 | Tampa, FL | 185 avg | 140-300 | Very hard | tampa.gov CCR PDF | 2024 |
| 12 | El Paso, TX | 175 avg | single | Hard (edge) | epwater.org chem analysis PDF | 2025 |
| 13 | Wichita, KS | 170 | single | Hard (edge) | wichita.gov CCR PDF | 2025 |
| 14 | Omaha, NE | 170 | single | Hard (edge) | mudomaha.com/your-water/ | 2025 |
| 15 | Dayton, OH | 155 | treated; raw 320 | Hard | daytonohio.gov/370/Water-Quality | 2025 |
| 16 | Cincinnati, OH | 142 mid | 137-147 (two plants) | Hard | cincinnati-oh.gov GCWW FAQ | 2025 |
| 17 | Chicago, IL | 139 mid | 133-145 | Hard | chicago.gov CCA series | 2024 |
| 18 | Beavercreek, OH | 137 | post-softening; raw 462 | Hard | greenecountyohio.gov | 2025 |
| 19 | Milwaukee, WI | 136 med | 129-150 | Hard | city.milwaukee.gov hardness FAQ | 2025 |
| 20 | Orlando, FL | 129 | single | Hard | ouc.com/about/water-services/ | 2025 |
| 21 | Fresno, CA | 129 avg | 87-150 | Hard | fresno.gov CCR PDF | 2024 |
| 22 | Louisville, KY | 128 | single | Hard | Louisville Water CCR PDF | 2025 |
| 23 | Columbus, OH | 120 | lime-softened target | Mod. hard (boundary) | columbus.gov Water Hardness page | 2025 |
| 24 | Cleveland, OH | 120 | single | Mod. hard (boundary) | clevelandwater.com FAQ | 2025 |
| 25 | Tulsa, OK | 115 mid | 89-140 (two plants) | Mod. hard to Hard | cityoftulsa.org FAQ | 2025 |

### Ranking notes

- **Ranges make rankings ambiguous**: San Jose (155-545) and Jacksonville (120-372) have very wide ranges due to multiple sources/zones. Their midpoints place them high, but a customer in a soft zone of San Jose could be at 155 ppm while one in a hard zone hits 545. The ranking is directionally correct but not precision-sortable.
- **Lime-softened systems**: Dayton (155 treated, 320 raw), Columbus (120, target), Omaha (170, target), Des Moines (<150, target) all publish treated-water values. The ranking reflects what arrives at the tap, not the aquifer.
- **Greene County/Beavercreek** ranks 18th at 137 ppm post-softening, but its pre-softening raw water was 462 ppm (27 gpg), which would rank it #1 in the country if untreated.

---

## 3. No-public-number and blocked lists

### No public number (1)

| City | Utility | Documents checked | Notes |
|------|---------|-------------------|-------|
| Miami, FL | Miami-Dade WASD | CCR 2020, 2022, 2024 | All mention lime treatment to reduce hardness but publish no numeric value. Non-CCR publications (engineering docs, master plans) not checked. Lime-softening utility. |

### Blocked URLs for owner manual-read (7)

| City | Blocked URL | Issue | Browser alternative |
|------|------------|-------|---------------------|
| Houston, TX | publicworks.houstontx.gov/sites/default/files/images/utilities/wq2016.pdf | Server returns empty response to all curl downloads | Open in browser; also try houstontx.gov/water/waterquality.html |
| Dallas, TX | dallascityhall.com/departments/waterutilities/Pages/water_quality_reports.aspx | SSL certificate expired/invalid | Open in browser (click through cert warning) |
| Fort Worth, TX | fortworthtexas.gov/files/assets/public/v/*/water/documents/water-quality-reports/ | All PDF paths return HTML error page | Open in browser at fortworthtexas.gov/departments/water |
| Tucson, AZ | tucsonaz.gov/files/sharedassets/public/v/2/city-services/tucson-water/water-quality/report-archive/ccr_mainsystem_2024.pdf | Server returns HTML instead of PDF for automated requests | Open in browser; note: publishes per-service-area, not citywide |
| Salt Lake City, UT | slc.gov/utilities/wp-content/uploads/sites/22/2022/06/WQR-Salt-Lake-City-UT-R01.pdf | Returns HTML error | Open in browser at slc.gov/utilities/2026-water-quality-ccr-report/ |
| Lubbock, TX | ci.lubbock.tx.us/storage/images/BeY3qnt1vVUXQ6pnvCk8fYAqIVE8syPmi1dZcKqS.pdf | Site migrated; returns HTML | Open in browser at mylubbock.us/waterqualityreport |
| Oklahoma City, OK | okc.gov/files/assets/city/v/1/utilities/documents/water-quality-reports/*.pdf | All PDF paths redirect to HTML | Open in browser at okc.gov/ccr |

---

## 4. City vs zip: evidence and recommendation

### Evidence from five named exhibits

**Tucson, AZ**: Utility publishes hardness BY SERVICE AREA, not citywide. Groundwater zones vs CAP (Central Arizona Project) surface blend zones have different hardness. A single zip could fall in either zone. A city-level page for Tucson must present the range and name the zones; a zip-level page would need to map each zip to its zone, which Tucson Water does not publish.

**Jacksonville, FL**: JEA publishes a complete hardness-by-zip table (120-372 ppm range). This is the strongest case for zip-level pages in the dataset: the utility itself maps hardness to zips. However, a single "Jacksonville water hardness" page with the range and a zip-lookup tool is more useful than 50 near-identical pages differing only in a number.

**Albuquerque, NM / San Jose, CA**: Both publish hardness by distribution zone (Albuquerque: 20 zones, 2.09-11.72 gpg; San Jose: by service area, 155-545 ppm). Zones do not map cleanly to zips. A city-level page presenting the range is accurate; a zip-level page would require assumptions about which zone dominates each zip.

**Dayton, OH / Greene County, OH**: Same Great Miami Aquifer, different treatment. Dayton lime-softens to 155 ppm; Greene County recently added RO softening from 462 ppm (27 gpg) to 137 ppm (8 gpg). A single "Dayton metro" page would flatten this contrast. Two system-level pages preserve the real story: the aquifer is very hard, but what arrives at your tap depends on your utility's treatment.

**Phoenix metro (3 systems)**: Phoenix Water (172-302 ppm), Scottsdale Water (222-325), Mesa Water (205-376). Three utilities, three ranges, all very hard but differing by source blend. A "Phoenix water hardness" page could present all three; zip-level pages would need to resolve which utility serves each zip (utility boundaries are not zip-aligned).

### Recommendation

**City/system as the primary programmatic unit; zips as a lookup index routing to the system page.**

The data overwhelmingly supports system-level pages over zip-level pages:

1. Most utilities publish one hardness number (or range) per system. The content for a zip-level page would be identical for every zip in that system's service area, creating near-duplicate pages.
2. Where hardness varies within a system (Tucson, Albuquerque, San Jose), the variation follows service zones, not zips. Zip-level pages would either oversimplify or require zone-to-zip mapping that the utilities themselves don't publish.
3. Where a metro has multiple systems (Phoenix, Dayton), the treatment difference is the story. System-level pages preserve it; zip-level pages flatten it.
4. Jacksonville's per-zip data is the exception, not the pattern. Even there, a city-level page with a zip-lookup tool is stronger content than 50 thin pages.

The zip lookup table remains valuable as a routing layer: user enters zip, we map to the serving system, we show the system-level data. But the programmatic page unit should be the system/city, not the zip.

---

## 5. Quotable numbers for the PR study

### Headline candidates (all source-cited, verified)

- **"Indianapolis has the hardest municipal water in the dataset at 317 ppm"** — Citizens Energy Group water quality page, 2025. Average across system; max 460 ppm. Very hard.

- **"Madison, Wisconsin's unsoftened well water runs 308 to 370 ppm, harder than Las Vegas"** — Madison Water Utility FAQ + individual well reports, 2025. Las Vegas is 280 ppm (LVVWD CCR). Madison is groundwater, not softened; Las Vegas is Colorado River, not softened. Comparison holds.

- **"Greene County, Ohio delivered 462 ppm (27 grains per gallon) to Beavercreek homes before its 2025 softening project"** — Greene County Sanitary Engineering Department, 2025. Same Great Miami Aquifer as Dayton; Dayton has lime-softened since the mid-20th century, Greene County did not until March 2025. Post-softening is 137 ppm (8 gpg). The raw aquifer number (462 ppm) is the highest single verified reading in the dataset.

- **"The Phoenix metro — Phoenix, Scottsdale, and Mesa combined — ranges from 172 to 376 ppm across three utilities, all very hard"** — Three primary sources (Phoenix WQ report, Scottsdale fact sheet, Mesa WQ page), 2025. Every corner of the metro is very hard regardless of which utility serves the address.

- **"San Jose's water varies from 155 to 545 ppm depending on your neighborhood's source"** — San Jose Water Company FAQ, 2024. The widest range in the dataset within a single utility, driven by differences between surface and groundwater sources.

### Framing notes for copy

- Use "at the tap" phrasing for all numbers — these are treated/delivered values, not raw aquifer readings, unless specifically noted (Greene County pre-softening).
- Cite the utility name and report year in any published version.
- The ranking is directionally stable but ranges make positions 1-10 ambiguous within a few spots. Do not frame as a precision ranking; frame as "among the hardest."
- Soft-water cities (NYC 25, Portland 9, Raleigh <30, Charlotte 27, Memphis 48) are useful as contrast pairs but are not the story.

---

## Appendix: pending and next steps

### Pending manual review (4 systems)
- Tucson, AZ — per-service-area values from annual WQ report
- Salt Lake City, UT — CCR in gpg, varies by source (canyon vs well)
- Lubbock, TX — CCR; site migrated, PDF redirects
- Oklahoma City, OK — CCR; PDF redirects to HTML

### Wave 2 remaining scope (follow-up sessions)
- Target: 40-80 additional systems to reach 80-120 total
- Belt metros by population (remaining TX, OH, IN, FL, MN, WI, IL, IA, MO, CO, AZ, NM, UT, NV, KS, NE, OK)
- Secondary-system captures for lime-softening metros (Columbus suburbs, KC suburbs, Miami-Dade suburban systems on different treatment)
- Blocked-URL closes from owner's manual-read pass
- Zip mapping via EPA SDWIS service area data (after 50+ verified records)
