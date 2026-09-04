# Final report format

Use this shape for every task report. Headings are fixed; leave a heading in place with "none" rather than omitting it, so the owner can see that each question was asked.

```
## Summary

### What changed
| File | Change |
|---|---|
| path/to/file | one line, specific |

### Approved scope clarifications
Items the owner approved after you asked. "none" if none.

### Deviations
Anything you did that the brief did not say to do, approved or not. "none" only if the diff contains nothing the brief did not name.

### Known limitations
Anything the brief asked for that could not be fully done, and why.

### Environment
Which environment each verification ran against (production / preview / local).

### Deploy verification evidence
For each changed surface: URL fetched (with cache-buster), then the served excerpt.
```

## What counts as evidence

Acceptable:

```
/terms (fetched ?_nocache=legal-20260902e):
<title>Terms and Conditions | AG Water Softener</title>
<meta name="robots" content="noindex"/>
```

```
POST /api/oto-accept with {}:
{"ok":false,"fallback":true,"url":"https://buy.stripe.com/..."}
```

```
Columbus: <h2>What Columbus water means for your hair and skin</h2>
```

Not acceptable:

- "Verified on production." (assertion, no excerpt)
- "All six inserts confirmed." (count, no strings)
- A table of ✓ marks with no fetched text
- "Received 20.1KB (200 OK)" alone (size and status, no content)
- Local build output described as production

## Session-gated or unreachable surfaces

State it, then paste the nearest available proof:

```
Session-gated note: /thanks requires a valid ?session_id= to render the
verified order state. Full render verification rides the next live order.

GCR code in deployed bundle (/assets/thanks-D53HRJk_.js):
renderOptIn=function(){window.gapi.load(`surveyoptin`,...
```

## Stale cache handling

If the first fetch shows the change absent:

```
First fetch (?_nocache=a1): change absent.
Vercel deployment dpl_xxx promoted at 14:32 UTC.
Second fetch (?_nocache=a2): change present:
<excerpt>
```

Report both. Never report only the second as if the first did not happen.
