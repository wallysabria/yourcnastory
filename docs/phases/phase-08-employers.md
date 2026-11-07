# Phase 8 — Employers content and build

> ⛔ **Owner approval required.** Run this only after you've confirmed the Employers content
> is final. Include your approval in the message where you paste this prompt.

**Purpose:** bring the Employers section across with the same rigor as Career Seekers, then
switch its links on.

---

## Prompt

This is **Phase 8: Employers content and build**. **I approve starting the Employers
section.** Re-read `CLAUDE.md`. Start in **Plan Mode** and wait for my approval.

Before planning, check with me:
- Is the Employers content on the live site now final, or are there updated files/edits to
  use instead? (If edits are provided, they go in `_source/employers-updates/`.)
- Microsoft Forms on `/cnap-employer-signup/`: keep the embed as-is, or another approach?
- Does a Spanish version of `/faqs/` exist (per the Phase 1 findings)?

### Do in this phase
Apply Phases 3–5 to every URL tagged **employers** in the manifest, EN + ES:
1. **Content extraction** — verbatim; Spanish frozen; job-board references removed and
   logged; anchors preserved (e.g. `/employer-resources/#dsd-approval` and every other
   linked anchor); metadata ported; parity checks pass. If updated content is supplied,
   parity is checked against it instead and every difference from the live site is listed.
2. **Templates and pages** — reuse existing templates; new ones only where needed. Visual
   parity against Phase 1 screenshots (or the supplied updates).
3. **Microsoft Forms** per the decision above — accessible, responsive, consent-aware if it
   sets cookies, tracked per the tag plan.
4. **Switch on Employers** — set the flag; every inactive link across header, footer,
   menus, homepage and chatbot redirects becomes live. Add Employers URLs to search,
   sitemaps and hreflang.
5. **Analytics, accessibility, performance** — same checks as Phase 5 on the new templates.

### Acceptance criteria
- Every Employers URL passes content parity, visual comparison, link and anchor checks.
- With the flag on, there are no inactive or broken links anywhere on the site.
- Zero axe violations; mobile Core Web Vitals in range.
- Report to `docs/reports/phase-08.md`.

Stop when done and wait for me.
