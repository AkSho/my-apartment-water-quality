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

Plain text fields are acceptable for launch. `hardness_ppm` can be numeric and
`hardness_estimated` can be checkbox/boolean if preferred.

The endpoint also supports the simple Airtable starter table visible in the
current base. If the launch-schema write fails, it retries with:

- `Email Address`
- `Zip Code`
- `Source/Page`

## Data Build

For the current launch seed dataset:

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
- `/report?zip=99999`
- `POST /api/submit-lead` with a valid email and ZIP
- Email never appears in the report URL
- AG Water Softener CTA opens in a new tab
- Print/download hides the AG reveal section

## Current Limitation

The AG CTA still points to the page placeholder until the real PDP URL exists.
This is acceptable for tool-traffic testing, but not for a complete purchase
path.
