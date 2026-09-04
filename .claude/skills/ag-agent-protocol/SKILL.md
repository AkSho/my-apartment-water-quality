---
name: ag-agent-protocol
description: Standing working rules for every coding, content, or deploy task on the GRN Labs repos (ag-water-softener / agsoftener.com, agwaterqualityreport / myapartmentwaterquality.com, grnlabs-org). Use this skill on ANY task in these repos, even small ones, and even when the brief does not mention it. It covers how to read a brief, which surfaces are owner-only, how locked strings work, when to ask clarifying questions, what counts as a deviation, what deploy evidence is required, and how to report. If a task touches these codebases or their production sites, this skill applies.
---

# AG agent protocol

These repos are run by one owner with one strategist and one agent (you). Briefs arrive from the owner, often relayed by hand from the strategist's drafts. The rules below exist because every one of them was learned from a real incident: a fabricated verification table, a silently added word in a locked heading, a stale CDN render mistaken for production, a placeholder link shipped as a legal page. Follow them so the owner can accept your work on evidence instead of trust.

## 1. Before touching anything: ask

End-of-brief instructions always say "ask clarifying questions before proceeding." Treat that as the first step, not a formality. Read the whole brief, inventory the files it touches, then ask about anything that is ambiguous, missing, or that you would otherwise have to assume: insert positions, template-vs-page scope, routing patterns, which of several similar components, environment availability. A question that turns out to be unnecessary costs one message. An assumption that turns out to be wrong costs a redeploy and the owner's confidence.

Report what you found during inventory even when you have no questions. "The heading lives in a shared template, so changing it affects all 40 pages, not the two named" is exactly the kind of finding the owner needs before you act.

## 2. Deviations are reported, never improvised

A deviation is anything you do that the brief did not say to do. That includes additions. Adding a helpful sentence, fixing an unrelated typo you noticed, "improving" a locked string, adding a field the brief omitted, changing a file the brief did not name: all deviations.

When you find that the brief cannot be executed as written, stop and report. Say what you found and what the options are. Do not pick one. The owner picks.

When a deviation is approved, log it in your final report under an "Approved scope clarifications" heading, separate from "Deviations: none." If you executed a deviation without approval, say so plainly. A report that says "Deviations: none" while the diff contains one is the single worst outcome this protocol exists to prevent.

## 3. Locked strings are character-for-character

Any copy marked "locked" in a brief is copied exactly: punctuation, casing, spacing, anchor text, link targets. Not paraphrased, not tidied, not title-cased, not given a serial comma. If a locked string looks wrong to you (typo, awkward phrasing), report it and wait. The owner may have amended it deliberately in relay.

If a brief references locked copy that is not attached, ask for it. Never build from placeholders or from a previous draft you happen to have in context.

## 4. Owner-only surfaces

These are never touched unless the brief carries an explicit, scoped exception naming the exact change:

- Site navigation
- Site footer (all repos)
- The product detail page (agsoftener.com `/`) including its FAQ accordion
- The product catalog and Stripe products/prices
- Content Security Policy configuration

A scoped exception covers only what it names. "Change the Terms link href from `#` to `/terms`" does not license touching the link text, the adjacent link, or the footer layout. When a brief needs a footer or nav change and carries no exception, ask.

## 5. Environment honesty

Every report that asserts production behavior states which environment it ran against. A local dev server, a preview deployment, and production are three different things. Results from one reported as another is fabrication regardless of intent.

Preview deployments may not exist (Hobby-plan Vercel projects have no branch deploys). If you cannot test in the environment the brief asks for, say so and state what you could test instead. Do not silently downgrade.

## 6. Deploy verification: evidence, not assertion

"Verified on production" means you fetched the production URL and pasted what it returned. Required in every deploy report:

- The production URL fetched, with a fresh cache-busting query parameter (`?_nocache=<task>-<date>-<n>`), a new value on every fetch
- An excerpt of the served response showing the changed content: the locked string, the schema block, the header, the href, whatever the task changed
- For schema and structured-data work: validator output
- For anything session-gated or unreachable by direct fetch (the thanks page, authenticated flows): say so explicitly, paste what you can (deployed bundle contents, a safe endpoint probe), and state that full proof rides the next live event

Use curl with cache-busting for verification. Fetch tools that pass through intermediate caches have served stale pre-deploy pages more than once while production was correct. If a fetch shows your change absent, re-fetch with a new cache-buster before reporting failure, and if it is still absent, report that plainly rather than assuming the deploy failed or succeeded.

A report without pasted evidence will not be accepted. See `references/report-format.md` for the exact shape.

## 7. Stale cache is a valid explanation

Both production sites sit behind edge caching with long revalidation windows. A fetch that returns old content is not proof the deploy failed; it is a lead. Diagnose before concluding: confirm the deployment promoted, then fetch with a fresh cache-buster. Report both the stale result and the confirming one.

## 8. Compaction addendum

If your context is compacted mid-task, re-read the brief in full before continuing. Never reconstruct instructions, locked strings, or scope from memory. After compaction, re-verify any "done" claims against the brief's verification list before reporting; post-compaction reports have previously claimed completion of work that was never committed.

## 9. Read-only tasks are read-only

When a brief says read-only, investigation-only, or report-only, any write is a deviation. Do not fix what you find. Report it with evidence and stop.

## 10. Scope discipline for the three sites

- **agsoftener.com** owns all commercial, comparison, and mechanism content. Never create informational or local-hardness content here.
- **myapartmentwaterquality.com** is the informational lane: hardness lookups, city pages, methodology, the hair advertorial. It never targets commercial keywords. It may link to agsoftener.com; it never sells on-page.
- **grnlabs.org** is the parent entity spine. Organization schema on all three sites forms a closed triangle (GRN declares AG and myapt; AG carries `parentOrganization` → GRN). Never break that triangle when editing schema.

Legal pages, thank-you pages, and other utility surfaces carry `noindex` and are kept out of sitemaps.

## 11. Copy you write

Most briefs supply locked copy. When a brief asks you to write anything customer-facing (alt text, a label, an error state), read `references/house-rules-summary.md` first. The full house rules and canonical strings live in the repo's project docs; the summary covers the rules you are most likely to trip on: no em dashes, no three-item lists, no trust-pleading adjectives, sentence-case headings, canonical product names on first reference.

## 12. Report shape

End every task with the report format in `references/report-format.md`: what changed (file by file), approved scope clarifications, deviations (with the honest answer), known limitations, environment, and pasted production evidence. Keep it factual. Do not summarize evidence; paste it.

## References

- `references/report-format.md`: the required final-report template and examples of acceptable evidence.
- `references/house-rules-summary.md`: the short list of house writing rules for any copy an agent writes.
