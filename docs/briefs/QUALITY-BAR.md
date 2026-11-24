# Quality bar for briefs from mailbox/briefs (owner, Nov 24, 2026)

Follow this for every brief unless the brief says otherwise.

1. Every report states what it rests on (commit, file, query, date), what was not checked, and what would prove it wrong.
2. A change to what a customer sees or is told, to money, or to a live system: before the PR is offered, a fresh reviewer that has not seen the build reads the diff and every rendered variant. Its findings go in the report as written, including any you disagree with.
3. Rendered output in a report is real output from the code at the PR's commit, in full, with test values. No customer fields; order numbers are fine.
4. Proof in production is the next real event, read where it lands (Sent folder, Airtable, Stripe, runs.log). Say how you will know. Never create an order, email a customer, or use Stripe test mode to prove it.
5. A site change is used as a customer would use it before it is called done: reload, back button, slow network, a second visit. The report shows what the customer sees in each.
6. Stop at the open PR. The ops chat reads the report before the owner merges. Do not call a PR ready to merge.
7. No ceremony on small things: a docs fix or a lookup needs only item 1.
