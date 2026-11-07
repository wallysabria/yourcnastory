# Phase 9 — Employers chatbot and Employers SEO/AEO

> ⛔ Requires Phase 8 to be approved and merged.

---

## Prompt

This is **Phase 9: Employers chatbot and Employers SEO/AEO**. Re-read `CLAUDE.md`,
`docs/reports/phase-06.md` and `docs/reports/phase-07.md`. Start in **Plan Mode** and wait
for my approval.

### Part A — Employers chatbot
1. A second configuration of the Phase 6 engine — no new engine.
2. Draft a fresh system prompt for employers and facility administrators: CNAP program
   overview, financial awards, CUSP, NATP pathways, Earn and Learn for facilities, employer
   resources, how to apply. Facts from the knowledge base only. **I (and the client) approve
   the prompt before it's used.**
3. Knowledge set: Employers pages (EN + ES), employer documents, approved external sources.
4. Appears only on Employers pages; the Career Seekers bot appears everywhere else. Each
   bot redirects warmly to the other's section for out-of-scope questions (update the
   Career Seekers bot's redirect now that employer pages are live).
5. Same safeguards, logging, redaction and review page (filterable by bot); same eval
   approach with an employer test set (stop and ask if none is provided — you may draft
   one for approval).
6. Signup handoff: confirm with me whether employers get the Mailchimp signup, a link to
   the award application, or both.

### Part B — Employers SEO/AEO
Apply Phase 7 to every Employers URL: metadata parity, hreflang, sitemaps, Search Console
redirect validation, structured data, AEO technical items, and content recommendations
(added to the same recommendations file, marked Employers).

### Acceptance criteria
- Employer bot passes its eval suite; both bots route correctly by page.
- All Phase 7 checks pass site-wide.
- Report to `docs/reports/phase-09.md`.

Stop when done and wait for me.
