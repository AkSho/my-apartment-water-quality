# Working rules for this repo

Every task in this repo, regardless of size, runs under the `ag-agent-protocol` skill. Invoke it before reading the brief. After any context compaction, re-read the brief file under `docs/briefs/` (or ask for it) before continuing; never reconstruct a brief from memory.

Non-negotiables, even if the skill is not loaded:
1. Ask clarifying questions before proceeding on any brief. If none, say so explicitly.
2. Owner-only surfaces (nav, footer, PDP, Stripe catalog/prices/shipping rates, CSP) change only under a brief that names a scoped exception.
3. Locked strings are reproduced character-for-character. An owner amendment in relay is the string. Any variance is reported under Deviations.
4. Evidence is real program output: cache-busted production fetches, actual rendered template output, actual API responses. Never type an example and label it rendered.
5. Claims about how a live system behaves (Stripe, Airtable, Sheets) are verified against several live objects, never inferred from one.
6. Never write test data to a real customer's row or sheet line; use a test row and delete it.
7. Reports use the fixed headings: What changed (file by file), Approved scope clarifications, Deviations, Known limitations, Environment, Deploy verification evidence.
8. A default that invents a product, carrier, or value is worse than stopping and logging. When unsure, skip and flag.
