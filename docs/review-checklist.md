# Internal review checklist

Use at each phase gate before merging. Tick what applies to the phase; leave a note for
anything that fails. Review on the **Vercel preview**, not just the report.

## Every phase
- [ ] Claude Code planned first and we approved the plan
- [ ] Work stayed inside the phase's scope (nothing from later phases, no Employers work
      before approval)
- [ ] Report saved in `docs/reports/` with evidence for each acceptance criterion
- [ ] Logs updated: Spanish review, content changes, design changes, decisions needed
- [ ] No secrets or `/_source/` files in the PR
- [ ] CI green
- [ ] Open questions answered or carried forward

## Phase 1 — Audit
- [ ] URL counts look right (spot-check 10 URLs we know, EN and ES)
- [ ] Every EN page has an ES counterpart or is flagged
- [ ] Section tags are correct (Career Seekers / Employers / shared); unclear ones decided
- [ ] vi/zh redirect targets make sense
- [ ] Popups and every Mailchimp form placement found
- [ ] Job-board references list looks complete

## Phase 2 — Foundation
- [ ] Header, mega menus, footer and announcement bar look like the live site (desktop + phone)
- [ ] Language switcher lands on the matching page in the other language
- [ ] Employers links visible but inactive
- [ ] Old vi/zh URLs and slashless URLs redirect correctly (test a few by hand)
- [ ] Preview isn't indexable (view source: `noindex`)

## Phases 3–4 — Career Seekers content and pages
- [ ] Pick 5 EN and 5 ES pages: text matches the live page word for word
- [ ] Spanish untouched (except job-board removals in the log)
- [ ] Deep links work: e.g. `/community-resources/#practice-exam` scrolls to the right spot
- [ ] Images, PDFs and videos load; PDF links match the old paths where required
- [ ] Career path pages all present, in both languages
- [ ] Homepage employer blocks show but don't link
- [ ] Mailchimp form: works, shows errors properly, SMS consent text matches, only EN/ES
      language options, lands in the **test** audience/tag
- [ ] Search: finds pages (and PDFs) and stays in the current language
- [ ] Any design changes were proposed and approved first
- [ ] Phone check: menus, form, popups, search all usable on an actual phone

## Phase 5 — Analytics, consent, accessibility, performance
- [ ] Banner appears; Decline is as easy as Accept; both languages
- [ ] Nothing tracks before Accept (GA4 DebugView / Tag Assistant); tracking works after
- [ ] "Privacy choices" link in the footer reopens preferences
- [ ] Privacy policy and banner copy sent to the client's counsel
- [ ] Keyboard-only walkthrough of a page: everything reachable, focus visible
- [ ] Pages feel fast on a phone

## Phase 6 — Career Seekers chatbot
- [ ] Ask 10 real questions in English and 10 in Spanish: correct, sourced, linked, ≤ 2 paragraphs
- [ ] Out-of-scope and employer questions handled politely
- [ ] Unknown questions get the single fallback with next step
- [ ] Try to break it (ask it to ignore its instructions, off-topic requests): it stays on task
- [ ] In-chat signup works; the log shows the event but not the personal details
- [ ] Review page and summary report work and require a password
- [ ] Logged-chat disclosure is visible

## Phase 7 — SEO/AEO
- [ ] Top Search Console pages all resolve (200 or one 301)
- [ ] Titles and descriptions match the old site
- [ ] Structured data validates (Rich Results Test on a few pages)
- [ ] Recommendations file reviewed; nothing applied without approval

## ⛔ Before Phase 8
- [ ] Employers content confirmed final (or updates supplied)
- [ ] Microsoft Forms decision made
- [ ] Spanish `/faqs/` question answered
- [ ] Approval message sent to Claude Code

## Phases 8–9 — Employers
- [ ] Same content, page and form checks as Phases 3–4, on Employers pages
- [ ] All previously inactive links now work, everywhere
- [ ] Employer bot prompt approved by us and the client; bots show on the right pages

## Phase 10 — Full QA
- [ ] Go/no-go report reviewed; every exception approved
- [ ] Spanish review list sent to native speakers; results back and applied (via a
      separately approved change)
- [ ] Counsel sign-off on privacy policy and banner
- [ ] Client has reviewed the full preview

## Phase 11 — Launch
- [ ] Runbook approved; roles assigned (who changes DNS, who verifies)
- [ ] WordPress backed up and still running for rollback
- [ ] Post-launch checks done in the first hour
- [ ] Sitemaps submitted
- [ ] Monitoring schedule running; first weekly summary received
