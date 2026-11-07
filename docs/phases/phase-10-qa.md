# Phase 10 — Full-site QA and parity

**Purpose:** one last, complete pass over the whole site as it will launch, before anyone
touches DNS.

---

## Prompt

This is **Phase 10: full-site QA and parity**. Re-read `CLAUDE.md`. Start in **Plan Mode**
and wait for my approval. Fix only what's clearly a defect; anything that changes content,
design or scope → ask.

### Do in this phase
1. **URL integrity:** every URL in the manifest (EN, ES, vi, zh, slashless variants, old
   slugs, documents) returns its intended status and destination on the production-ready
   build. Single-hop redirects only. Zero unexpected 404s from a full crawl.
2. **Content parity re-run** for every page (both sections, both languages); Spanish
   unchanged except logged job-board removals.
3. **Job-board sweep:** zero references anywhere (pages, metadata, documents we control,
   chatbot knowledge, code).
4. **Visual regression** of every page, desktop and mobile, against the reference
   screenshots; approved design changes noted.
5. **Functional:** navigation and mega menus, language switcher on every page, search (both
   languages, PDFs), popups, Mailchimp form (every instance, against the test target),
   Microsoft Forms, chatbots (both, both languages, signup handoff), consent (accept,
   decline, GPC, change later), analytics events after consent only.
6. **Cross-browser and device:** current Chrome, Safari (macOS and iOS), Firefox, Edge,
   Android Chrome; small phone, tablet, desktop.
7. **Accessibility:** full WCAG 2.1 AA pass, including a screen reader walkthrough of key
   journeys (find training info, sign up, use the chat, switch language).
8. **Performance:** mobile Core Web Vitals for every template; compare to the live site.
9. **SEO:** metadata, hreflang, sitemaps, robots, structured data and canonicals across
   the whole site; production build would be indexable while previews are not.
10. **Security and privacy:** no secrets in the repo or client bundle; security headers
    proposed and set (CSP that allows only the approved third parties); chat logging and
    redaction verified; review page access protected.
11. **Hand-offs:** compile `docs/logs/spanish-review-log.md` into a clean list for native
    speakers; confirm privacy policy and banner copy status with counsel; list every open
    decision.

### Acceptance criteria
- Every check above passes or has an owner-approved exception.
- `docs/reports/phase-10.md` contains the full results and a go/no-go recommendation.

Stop when done and wait for me.
