# Report URL Migration Plan: `/report?zip=` → `/report/{zip}`

## Goal

Migrate report pages from query-parameter URLs (`/report?zip=07103`) to path-based URLs (`/report/07103`) for better crawlability, shareability, and canonical handling.

## Route Structure

### New route

`/report/{zip}` — served by the same Vercel serverless function (`api/report.js`).

### Vercel config

```json
{
  "rewrites": [
    { "source": "/report/:zip(\\d{5})", "destination": "/api/report?zip=:zip" },
    { "source": "/report", "destination": "/api/report" },
    { "source": "/report/", "destination": "/api/report" }
  ]
}
```

The existing `/report?zip=XXXXX` query-parameter route stays functional but is not the canonical form.

### 301 redirects from old URLs

Add a redirect in `vercel.json`:

```json
{
  "redirects": [
    { "source": "/report", "has": [{ "type": "query", "key": "zip", "value": "(?P<zip>\\d{5})" }], "destination": "/report/:zip", "statusCode": 301 }
  ]
}
```

This ensures:
- `/report?zip=07103` → 301 → `/report/07103`
- Any existing links, bookmarks, or cached Google URLs transfer authority to the new path
- The serverless function itself does not need to change (it reads `req.query.zip` either way)

### Canonical handling

Each report page at `/report/{zip}` gets a self-referencing canonical:

```html
<link rel="canonical" href="https://www.myapartmentwaterquality.com/report/07103">
```

Add this to the `pageShell()` function in `lib/report-template.js` when a valid zip is present. Unknown-zip and error pages remain `noindex` with no canonical.

## Sitemap Batching Strategy

### Rationale

The hardness lookup currently covers 4 exact-match zips and 99 two-digit prefix estimates. Every valid US zip (roughly 42,000) will resolve to a report page via prefix fallback. Submitting all of them to the sitemap would:

- Signal low-quality, thin content (most are estimates with the same per-state copy)
- Risk crawl budget waste before the dataset is mature
- Create thousands of indexed pages before the content justifies them

Instead, roll out in controlled batches tied to data quality.

### Batch 1: Hard and very-hard zips in major metros (launch batch)

**Criteria:**
- Band is Hard or Very hard (the audience most likely to convert)
- Exact-match utility data exists (not prefix estimates)
- Metro population > 500K

**Estimated size:** 100-300 URLs once the utility dataset is expanded beyond the current 4 seed zips.

**Action:**
- Generate a static sitemap file (`sitemap-reports.xml`) from the hardness lookup, filtered by the criteria above
- Reference it from the main `sitemap.xml` as a sitemap index
- Each URL includes `<lastmod>` tied to the data generation timestamp

**Sitemap index structure:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.myapartmentwaterquality.com/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://www.myapartmentwaterquality.com/sitemap-reports.xml</loc>
  </sitemap>
</sitemapindex>
```

### Batch 2: Moderately hard metros

**Criteria:**
- Band is Moderately hard
- Exact-match utility data exists
- Metro population > 250K

**Trigger:** After Batch 1 has been indexed for 4-6 weeks and Search Console shows healthy coverage (no "Crawled — currently not indexed" warnings on Batch 1 URLs).

**Estimated size:** 100-200 additional URLs.

### Batch 3: Remaining exact-match zips

**Criteria:**
- Any band
- Exact-match utility data exists (not prefix estimates)

**Trigger:** After Batch 2 is healthy. Dataset should have broadened coverage by this point.

### Batch 4: High-confidence prefix estimates

**Criteria:**
- Prefix estimates only
- Band is Hard or Very hard
- Prefix covers a state with relatively uniform water hardness (low variance between counties)

**Trigger:** Only after the dataset includes enough exact-match records to validate prefix estimates against. This batch may never ship if the estimates prove too noisy.

### Batches NOT planned

- Soft-water zips: these pages have minimal content (no AG card, short meaning section) and low conversion intent. Keep them accessible but not submitted to the sitemap.
- All 42K US zips: prefix estimates are labeled as such and carry the same copy per state. They exist for user convenience, not for indexing.

### Build automation

Add a script to `scripts/`:

```
node scripts/build-report-sitemap.js --batch=1
```

This reads `data/hardness-lookup.json`, filters by the batch criteria, and writes `sitemap-reports.xml`. Run it as part of the data build pipeline whenever `hardness-lookup.json` is regenerated.

## Rollout Sequence

1. **Expand the utility dataset** — the current 4 exact-match zips are not enough for Batch 1. The data pipeline needs to ingest utility records for the target metros.
2. **Implement the new route** — update `vercel.json` rewrites, add 301 redirects from old URLs, add canonical tags to the template.
3. **Generate Batch 1 sitemap** — build `sitemap-reports.xml`, add to sitemap index.
4. **Submit to Search Console** — monitor indexing for 4-6 weeks.
5. **Proceed to Batch 2** based on coverage health.

## Risks

- **Thin content risk:** prefix-estimate pages share identical copy per state. Google may flag them as near-duplicate. Mitigation: keep prefix estimates out of the sitemap (Batches 1-3 are exact-match only).
- **Crawl budget:** even a few hundred pages are unlikely to stress budget on a small domain, but monitor via Search Console.
- **Old URL persistence:** any hard-coded `/report?zip=` links in emails, Airtable records, or ad campaigns will 301-redirect correctly. No broken links.
- **Per-zip meta descriptions:** already implemented with the per-zip template. Each page has a unique title and description.
