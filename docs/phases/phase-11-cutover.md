# Phase 11 — Launch cutover and monitoring

> Run only after you've signed off on the Phase 10 go/no-go. Every step that touches DNS,
> production settings or external accounts needs your explicit go-ahead in the moment.

---

## Prompt

This is **Phase 11: launch cutover and monitoring**. Re-read `CLAUDE.md`. Start in **Plan
Mode**. Produce a **runbook** first (`docs/launch/runbook.md`) and wait for my approval.
**Do not change DNS, domains, or any production account settings yourself** — the runbook
says who does each step; you prepare, verify and monitor.

## Production hosting decision — owner, 2026-11-19

Launch requires migration from the Vercel review deployment to **SiteGround Node.js hosting**: https://www.siteground.com/nodejs-hosting. Vercel is not the final production destination. This supersedes earlier Vercel-specific launch instructions; it does not authorize account changes, purchases, DNS changes or cutover now.

### Required SiteGround migration checklist

- [ ] Confirm the owner-selected SiteGround account/plan and access, supported Node version, build/runtime limits, GitHub deployment workflow, build/start commands and managed port binding for this exact Next.js application. Next.js support advertised by the provider does not establish compatibility for this repo.
- [ ] Audit and port Vercel-specific behavior: vercel.json redirects, proxy routing, environment checks (including VERCEL_ENV and SITE_LAUNCH_APPROVED), noindex/analytics gates, headers/security behavior, image optimization, static assets and API routes. Keep server routes available; do not switch to a static-only export that drops signup/chatbot functionality.
- [ ] Configure secrets privately in SiteGround, including Mailchimp and any approved chatbot/storage/analytics integration. Do not change the agency-owned Supabase decision or create a replacement database merely because the host changes.
- [ ] Deploy the approved commit to a separate SiteGround test application/temporary hostname. Protect it from indexing and keep live tracking off until the approved production gates are deliberately enabled.
- [ ] Run final QA on SiteGround: all built pages, complete approved redirect/retirement list, uploads, privacy deep links/dialogs, English-only Employer navigation, EN/ES Career Seekers, search, forms and any launch-enabled chatbot. Verify headers, consent/GPC, logging, performance and errors on that host; Vercel results alone are insufficient.
- [ ] Back up WordPress and document a tested rollback path. Keep WordPress available; do not overwrite/delete it when creating the Node app. Record whether rollback changes DNS, SiteGround application/domain routing, or both.
- [ ] Obtain owner approval of the SiteGround-tested runbook and Phase 10 go/no-go before domain changes. Preserve email/DNS verification records, connect apex/www with the approved canonical redirect, confirm SSL and Search Console verification, then deliberately enable production indexing and approved integrations only.
- [ ] Re-run production verification after cutover; monitor SiteGround application/build/runtime logs, 404s, redirects, forms, analytics and performance. Retain the Vercel review deployment until the owner decides its future.

### Runbook must cover
1. **Pre-launch (T-minus):** final production build; environment variables set in SiteGround
   production (Mailchimp, OpenAI if the chatbot is launch-enabled, analytics IDs, log storage); test-only targets removed;
   `noindex` removed from production only; WordPress site backed up and kept running
   (not deleted) for rollback; DNS TTL lowered in advance; Search Console verification method
   that survives the move.
2. **Cutover:** domain(s) connected to the tested SiteGround Node.js app (apex and `www`, with the correct canonical
   redirect); DNS changes and who makes them; SSL issued; `jobboard.` subdomain — record existing DNS and obtain its separate approved retirement/disposition; do not reactivate a job board or infer a replacement redirect.
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
