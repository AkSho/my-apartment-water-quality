# Launch Checklist

This site is a static landing page plus a static report page with one Vercel
serverless lead endpoint.

## Vercel Environment Variables

Set these before sending traffic:

- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`

If any value is missing, `/api/submit-lead` returns an Airtable configuration
error and the landing page still routes locally, but production lead capture is
not durable.

## Airtable Table Fields

Preferred launch-schema fields:

- `email`
- `zip`
- `hardness_ppm`
- `hardness_band`
- `hardness_estimated`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `timestamp`
- `source_url`
- `lookup_status`
- `matched_source`

Plain text fields are acceptable for launch. `hardness_ppm` can be numeric and
`hardness_estimated` can be checkbox/boolean if preferred.

The endpoint also supports the simple Airtable starter table visible in the
current base. If the launch-schema write fails, it retries with:

- `Email Address`
- `Zip Code`
- `Source/Page`
- `Lookup Status`
- `Hardness Band`
- `Hardness PPM`
- `Matched Source`

## Data Build

For the traffic-ready national estimate dataset:

```bash
node scripts/build-hardness-lookup.js --national-estimates
```

This keeps exact utility rows for known seed metros and adds clearly labeled
ZIP-prefix estimates for broad national coverage.

For the small seed dataset:

```bash
node scripts/build-hardness-lookup.js --sample
```

For national coverage, place official raw inputs in `data/raw/` and run:

```bash
node scripts/build-hardness-lookup.js
```

The build writes:

- `data/hardness-lookup.json`
- `data/hardness-build-report.json`

Review the build report before deploying paid traffic.

## Smoke Tests

After deploy, verify:

- `/`
- `/report?zip=78701`
- `/report?zip=97205`
- `/report?zip=60601`
- `/report?zip=89101`
- `/report?zip=30301`
- `/report?zip=00000`
- `POST /api/submit-lead` with a valid email and ZIP
- Email never appears in the report URL
- AG CTA opens `https://agsoftener.com/` in a new tab
- hard reports link to `https://agsoftener.com/?band=hard`
- very-hard reports link to `https://agsoftener.com/?band=veryhard`
- Print/download hides the AG reveal section
