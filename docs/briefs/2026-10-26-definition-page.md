# Brief: definition page + study method anchor (Oct 27, 2026)

Two repos, two commits, both today, in this order. Read the ag-agent-protocol skill first. Report in §12 format for each.

## Part A — myapt: method anchor on the study page (first)

Repo: agwaterqualityreport. On the hardest-cities study page, give the existing methodology text a named, linkable section: H2 "How we ranked the cities" with `id="method"`. Do not rewrite the method text; if it is currently split across paragraphs, gather it under that H2 unchanged. Add the anchor to the page's table of contents if one exists. Verify on production that `#method` resolves and the H2 is served once. Report the full URL with the anchor.

## Part B — agsoftener.com: /what-is-a-shower-water-softener

New page, Tier 2 in the register (row "ion exchange shower softener"). Title tag (no brand, keyword pages carry none): "What is a shower water softener? Filter vs softener vs whole-house" (≤60 chars). H1: "What is a shower water softener?". Uniqueness note: /shower-filter-vs-water-softener keeps the "filter vs softener" keyword; this page targets the definitional head query. Do not copy sentences between the two; link them both ways. Meta description (locked): "A shower water softener uses ion-exchange resin to remove the calcium and magnesium that make water hard, at one shower, with no plumbing changes. How it differs from a filter and a whole-house softener."

### Locked copy (character for character; register these as L-D1 to L-D8)

**L-D1, opening block, directly under the H1, four sentences, no heading:**
A shower water softener is a device that attaches to your shower and uses ion-exchange resin to swap the calcium and magnesium in your water for sodium, so the water coming out of the showerhead is soft. It is not a filter: a filter catches chlorine and sediment but leaves the minerals that cause hard water in place, so it doesn't soften anything. It is not a whole-house softener either, which treats all the water entering a home and needs plumbing work, so it isn't an option for most renters. In exchange for softening the water at one shower, it asks you to recharge the resin with plain salt, about every two weeks for one person at 10 grains of hardness, and more often in harder water.

**H2: Shower water softener, shower filter and whole-house softener compared**
Table, columns in this order: Shower filter · Shower water softener · Whole-house softener. Rows (L-D2):
- What it removes: chlorine and sediment / calcium and magnesium / calcium and magnesium
- Calcium and magnesium (hardness): not removed / swapped for sodium / swapped for sodium
- What it treats: one shower / one shower / all water entering the home
- What needs installing: screws on, no tools / sticks on, no plumbing changes / plumbing work
- Renter-friendly: yes / yes / usually not, needs landlord approval
- What it asks of the user: replace the filter / recharge the resin with plain salt / refill salt or book service
- What it costs to run: filter replacements / plain salt, and your time to recharge / salt and periodic service

Line under the table (L-D3): "Recharge intervals for water from 5 to 25 grains of hardness are on the recharge page." Link "recharge page" to /how-often-to-recharge-shower-water-softener.

**H2: How to tell which one you need**
Three short paragraphs, written by you within these facts, no new claims:
1. The strip: dip a hardness test strip in the tap. The USGS calls 7 to 10.5 grains per gallon "hard" and above 10.5 "very hard". A filter will not change that reading; a softener will.
2. Hair and skin: if the complaint is dryness, dullness, or tight skin after showers, the cause is hardness, which a filter leaves in place. If the complaint is a chlorine smell, a filter is the right tool.
3. Renting vs owning: a renter cannot change the plumbing, so the choice is between a filter and a shower water softener. An owner can also consider a whole-house softener.

**H2: How often a shower water softener needs recharging**
One paragraph: L2 verbatim ("about two weeks for one person at 10 grains with both cartridges; a second person halves that, and harder water shortens it"), the 40-minute pumped cycle per cartridge, plain salt (L4), and the link to the recharge page. Do not repeat the table.

**H2: Common questions** — mark up as FAQPage schema. Four Q&A, locked:

L-D4. Q: Can a renter install a water softener?
A: Yes, if it's a shower water softener. It attaches to the shower with adhesive hooks and a hose connection, so it needs no tools, no drilling and no plumbing changes, and it can come off when she moves. A whole-house softener needs plumbing work, so a renter usually can't fit one without the landlord's approval.

L-D5. Q: How often does a shower water softener need recharging?
A: It depends on how hard the water is and how many people use it. Harder water and more users mean sooner. A recharge uses plain salt and takes about 40 minutes per cartridge. The recharge table lists the interval for water from 5 to 25 grains of hardness.

L-D6. Q: Does a shower filter soften water?
A: No. A shower filter catches chlorine and sediment, but it leaves the calcium and magnesium that cause hard water in place, so the water is not softened. Softening needs ion exchange, which swaps those minerals for sodium. That is what a shower water softener does.

L-D7. Q: Is a shower water softener worth it for two people?
A: It can be, but two people use it up about twice as fast, so recharges come about twice as often. The decision is whether that upkeep is worth softer water at the shower. Check your water's hardness first, since harder water shortens the interval further.

**H2: The AG Water Softener** (last section, L-D8):
"The AG Water Softener Complete Set is a shower water softener with two cartridges in series, so one keeps softening while the other recharges. It is $279 with free shipping, a 90-day money-back guarantee from delivery, and a 12-month warranty." Link "AG Water Softener Complete Set" to /. Nothing else in this section: no "best", no competitor, no reviews, no second CTA.

### Page rules
- Doctrine fundamentals (same conventions as /shower-filter-vs-water-softener; mirror its byline, breadcrumb and schema pattern): visible "Updated Oct 27, 2026" line under the H1 matching Article dateModified; table of contents after the opening block (five H2s); BreadcrumbList schema if the sibling pages carry it; canonical self-referencing; every paragraph under 120 words; keyword in title, slug, first sentence, one H2 (the recharge H2) and one image alt.
- One image: reuse the PDP's ion-exchange diagram, alt "shower water softener ion exchange diagram", placed under the comparison table.
- Sources cited, two links out: the USGS water hardness classes page (for the 7 to 10.5 "hard" band) in the "How to tell" section; and Water Filter Guru's shower-filter lab testing, which found that no shower filter it tested lowered hardness, as one sentence under the comparison table in your own words with a link (fetch the page, confirm the finding is still stated, quote at most a short phrase; if you cannot confirm it on the live page, leave the sentence out and report).
- A second CTA is allowed only as a text link in "How to tell which one you need": "look up your city's hardness" to myapartmentwaterquality.com/water-hardness. No box, no button.
- IndexNow / Bing: if the repo has an IndexNow key configured, submit the URL; if not, report that it isn't configured (do not set it up in this brief).
- Not a sales page: one product mention, in the last section only. No buy button, no price above the last section.
- No "first", "only", "best", "actually", no em dashes, no triples, no rhetorical questions outside the FAQ Q lines.
- Schema: Article (headline = H1, publisher GRN Labs, dateModified today) + FAQPage with the four Q&A. No Product node on this page.
- Internal links in: from / (PDP) in the FAQ or "The fix" section as one sentence "What a shower water softener is, and how it differs from a filter"; from /how-often-to-recharge-shower-water-softener in its intro; from /water-softener-for-apartment; from /shower-filter-vs-water-softener. One sentence each, existing copy otherwise untouched; report each insertion's exact text and position before committing.
- Internal links out: recharge page, myapt study page (with #method), /setup.
- Sitemap: add the URL with lastmod today; PDP and any page you touched get lastmod today.
- Register: add L-D1 to L-D8 under "### Definition page strings (Oct 27, 2026)"; add the page to the Tier 2 row.

### Verification (production, cache-busters, paste excerpts)
- Title, H1, meta description, L-D1 byte-exact.
- Table served with the seven rows and three columns in order.
- Four FAQ answers byte-exact in the HTML and in the FAQPage JSON.
- validator.schema.org: 0 errors.
- Each inbound link present on its page; each outbound link resolves (200).
- Sitemap entry present.
- Lighthouse mobile ≥ 90 performance, 100 accessibility.
- Submit the URL in GSC URL Inspection → Request indexing (report whether quota allowed it).

Report, then stop. The release goes on the wire after this page is live.

## Clarifications

A1: (a). Rename the H2 to “How we ranked the cities” with id="method"; the three paragraphs stay as they are; the coverage paragraph stays where it is. The heading change is an approved scoped exception to the locked copy.
A2: Yes. Heading change is furniture: dateModified stays, sitemap lastmod moves to today.

B1: Use the real date, 2026-10-26, everywhere (Updated line, dateModified, lastmod). My brief had the wrong day.
B2: “What is a shower water softener? Filter vs whole-house” (54).
B3: My error; update the row where it is, Tier 1.
B4: Both are fixes. Amend L-D4 (locked, replaces the brief’s text): “Yes, if it’s a shower water softener. It attaches to the shower with adhesive hooks and a hose connection, so it needs no drilling and no plumbing changes, and it can come off when you move. A whole-house softener needs plumbing work, so a renter usually can’t fit one without the landlord’s approval.” Mirror the same text in the FAQPage JSON.
B5: Approved as you wrote it.
B6: (a), with a date stamp and the link: “In Water Filter Guru’s lab tests (updated Feb. 2026), nine popular shower filters ‘did nothing to reduce water hardness.’” Nothing about the one exception; that’s their claim to make, not ours to carry.
B7: Approved: author = the #organization @id, publisher GRN Labs with url https://grnlabs.org; BreadcrumbList like the sibling; no byline, Updated line only.
B8: All four approved as written. Dates: pages 2 to 4 get Updated line + dateModified + lastmod moved to 2026-10-26 (body-copy change); the PDP has no Updated line, so lastmod only (already 2026-10-26).
B9: At least one. Correct.
B10: Noted. I’ll request indexing in GSC; run Lighthouse locally; try the validator and give me the JSON-LD if it won’t run.
B11: Yes, save it word for word in both repos at docs/briefs/2026-10-26-definition-page.md, with these answers appended as “Clarifications.”
One addition to the page rules: H1 in the first viewport, answer in the first sentence, one CTA, no eyebrow line above the H1. Proceed.

Follow-up (Oct 26): "One CTA" vs the brief's allowed hardness text link. Owner answer: Keep both. The product link in the last section is the one CTA; the "look up your city's hardness" link stays as the brief's allowed informational text link.
