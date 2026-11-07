# Phase 3 — Content extraction (Career Seekers, homepage, shared pages)

**Purpose:** move the content into the repo **exactly** as it is today, in both languages,
and prove it with automated parity checks.

---

## Prompt

This is **Phase 3: content extraction**. Re-read `CLAUDE.md` (especially §4.2–4.5),
`docs/reports/phase-02.md` and the manifest. Start in **Plan Mode** and wait for my
approval.

### Scope
Only URLs tagged **career-seekers**, **shared** or **homepage** in the approved manifest,
English and Spanish. **No Employers content** — the homepage's employer blocks are the one
exception (ported as they appear today; links inactive).

### Do in this phase
1. **Extract content** into the Phase 2 schema (MDX/JSON) from the best source per page:
   database/WXR for structure and metadata, the rendered live page as the check. Preserve:
   - every heading, paragraph, list, table, link, button label, image (with alt text) and
     embed, in order
   - section anchor IDs exactly
   - per-page metadata (title, description, canonical, robots, OG) from the SEO plugin data
   - Spanish text **character for character** — including what looks wrong
   - the career path entries as a collection
   - testimonials as structured data
2. **Job-board references:** remove each one (English and Spanish), replacing it with
   nothing. Log each in `docs/logs/content-changes-log.md` (page, original text/link,
   result). This is the only permitted content change.
3. **Media:** bring in the images and documents these pages use, following the uploads
   approach approved in Phase 2. Do not rename or move any document whose path is in
   question — ask.
4. **Parity checks (automated, re-runnable script):** for every in-scope URL, compare the
   extracted content against the live page:
   - normalized visible text diff (report any difference)
   - link inventory (same destinations, minus logged job-board removals)
   - image count and alt text
   - anchor IDs present
   - metadata fields match
   Output `docs/reports/phase-03-parity.csv` with a pass/fail row per URL.
5. **Log, don't fix:** Spanish issues → `spanish-review-log.md`; other issues →
   `docs/audit/issues.md`.
6. Anything ambiguous (content only in a popup, Elementor-only widgets, conditional
   content, content differing between WXR and the live page) → stop and ask.

### Not in this phase
No page templates beyond what's needed to verify content renders; no forms, search,
analytics or chatbot. No Employers pages.

### Acceptance criteria
- Every in-scope URL (EN + ES) has a content file and passes the parity check, with any
  differences explained (job-board removals only).
- Zero Spanish text changes other than logged job-board removals (show the check).
- All anchors and metadata present.
- Report to `docs/reports/phase-03.md` with counts and the parity summary.

Stop when done and wait for me.
