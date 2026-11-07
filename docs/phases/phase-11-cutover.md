# Phase 11 — Launch cutover and monitoring

> Run only after you've signed off on the Phase 10 go/no-go. Every step that touches DNS,
> production settings or external accounts needs your explicit go-ahead in the moment.

---

## Prompt

This is **Phase 11: launch cutover and monitoring**. Re-read `CLAUDE.md`. Start in **Plan
Mode**. Produce a **runbook** first (`docs/launch/runbook.md`) and wait for my approval.
**Do not change DNS, domains, or any production account settings yourself** — the runbook
says who does each step; you prepare, verify and monitor.

### Runbook must cover
1. **Pre-launch (T-minus):** final production build; environment variables set in Vercel
   production (Mailchimp, Anthropic, analytics IDs, log storage); test-only targets removed;
   `noindex` removed from production only; WordPress site backed up and kept running
   (not deleted) for rollback; DNS TTL lowered in advance; Search Console verification method
   that survives the move.
2. **Cutover:** domain(s) added to Vercel (apex and `www`, with the correct canonical
   redirect); DNS changes and who makes them; SSL issued; `jobboard.` subdomain — if DNS
   still exists, point it to Vercel and 301 to `/career-seekers/`; otherwise note it.
3. **Immediate verification (first hour):** scripted check of every manifest URL against
   production; forms (real submission with a team member's details, then removed from the
   audience if needed); chatbots; consent and analytics (real-time reports); search;
   sitemaps reachable; robots.txt correct.
4. **Search engines:** submit sitemaps in Search Console (and Bing Webmaster Tools if used);
   request indexing for key pages.
5. **Rollback plan:** exact steps and decision criteria to point DNS back to WordPress.
6. **Monitoring (first 2–4 weeks):** daily 404 and redirect report, Search Console coverage
   and performance vs. baseline, analytics sanity (sessions vs. last period), form signups
   arriving in Mailchimp, chatbot health and spend, Core Web Vitals field data. Propose
   how this runs (scheduled checks + a short weekly summary).
7. **Decommission:** when and how the WordPress site and MxChat are retired (owner
   decision, not before monitoring is stable).

### Acceptance criteria
- Runbook approved before launch day.
- After cutover: every manifest URL verified on production; integrations confirmed live.
- `docs/reports/phase-11.md` with launch results and the monitoring schedule.
