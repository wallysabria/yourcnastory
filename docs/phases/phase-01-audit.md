# Phase 1 — Audit and inventory

**Purpose:** build the source of truth for everything that follows — every URL, page,
anchor, document, embed and integration on the live site — before any building starts.
This phase is **read-only** toward the site: nothing is ported or built.

---

## Prompt

This is **Phase 1: audit and inventory**. Re-read `CLAUDE.md`. Start in **Plan Mode** and
wait for my approval.

The audit covers the **whole site** (both sections), because the URL manifest and redirects
must be complete. Auditing Employers pages is allowed; **porting** them is not.

### Inputs
- `_source/wordpress/export.xml` (WXR)
- `_source/wordpress/database.sql` (if present — use it only for: translated slugs and
  Spanish content from the translation plugin's tables, SEO plugin metadata, and WordPress's
  old-slug redirect records. Never extract users, emails or form entries.)
- `_source/uploads/` (if present)
- The live site: https://yourcnastory.org (crawl politely: identify the crawler, limit
  concurrency, respect robots.txt). Include `/es/`, and `/vi/` and `/zh/` **only** to map
  them for redirects.

### Do in this phase
1. **URL discovery** from every source and reconcile them: live sitemaps (find them via
   robots.txt / the SEO plugin's sitemap index), a full crawl following internal links,
   the WXR, the database's old-slug records, and menus. Report URLs found in one source but
   not another.
2. **URL manifest** — `docs/audit/url-manifest.csv` (and `.json`), one row per URL:
   - `url`, `lang` (en/es/vi/zh), `section` (career-seekers / employers / shared / other),
     `status` (live code: 200/301/404…), `redirect_target` if any
   - `counterpart` (the EN↔ES pair; vi/zh → English target)
   - `content_type` (page, careerpath entry, post, attachment page, archive, etc.)
   - `template_guess` (which page layout it uses)
   - `title`, `meta_description`, `canonical`, `robots`, `og_title`, `og_description`,
     `og_image`, `h1`
   - `anchors` (all `id`s that are linked to from anywhere, internal or menu)
   - `forms_embeds` (Mailchimp, Microsoft Forms, video, iframes, popups)
   - `jobboard_refs` (count)
   - `notes`
   Flag every URL whose section is unclear — I will decide.
3. **Planned redirects** — `docs/audit/redirects-proposed.csv`: vi/zh mappings per
   `CLAUDE.md` §3, slashless → slashed, WordPress old slugs, and anything else you find.
   Each row: `from`, `to`, `type`, `reason`. Nothing goes live from this file until approved.
4. **Anchor inventory** — every in-page anchor used in menus or links, with the page it
   must exist on. Flag any link to an anchor that doesn't exist today.
5. **Uploads/document inventory** — `docs/audit/uploads-inventory.csv`: every file under
   `/wp-content/uploads/` that is referenced by a page, menu or another file; type, size,
   which pages link to it, and whether it's referenced externally (if Search Console data
   isn't available yet, note it as unknown). Separate **documents** (PDF, DOCX, XLSX…) from
   **images**. List unreferenced uploads separately — do not discard anything.
6. **Integrations and scripts inventory** — `docs/audit/integrations.md`: every third-party
   script, tag, pixel, iframe and embed on the live site (GTM, analytics, Clarity, Mailchimp,
   MxChat, Microsoft Forms, video hosts, fonts, anything else), with where it appears.
   Document every **Elementor popup** (trigger, content, pages) and every **Mailchimp form
   instance** (pages, placement, exact fields and the SMS consent text).
7. **Global elements** — header, mega menus (both languages), footer, announcement bar,
   language switcher, search, back-to-top, chat widget: structure and behavior on desktop
   and mobile. Capture reference screenshots of every **Career Seekers**, **shared** and
   **homepage** URL (desktop 1440px and mobile 390px, both languages) into
   `docs/audit/screenshots/` (gitignored if large — propose where they should live).
8. **Design reference** — `docs/audit/design-reference.md`: fonts (families, weights,
   sources), colors, type scale, spacing, breakpoints, buttons, cards, form styles, icons,
   as extracted from the live CSS. Note anything that appears to be a licensed font.
9. **Job-board references** — `docs/audit/jobboard-references.csv`: every reference in
   English and Spanish (page, element, exact text/link). Nothing is removed yet.
10. **Content observations (log only):** Spanish issues → `docs/logs/spanish-review-log.md`.
    Broken links, missing alt text, empty pages, duplicate titles, other problems →
    `docs/audit/issues.md`. **Change nothing.**
11. **Open questions** I must answer: does a Spanish `/faqs/` exist; unclear sections;
    source conflicts. Add them to `docs/logs/decisions-needed.md`.

### Not in this phase
No Next.js app, no content conversion, no redirects applied, no deletions.

### Acceptance criteria
- Manifest covers every URL from every source, with reconciliation results shown
  (counts by source, by language, by section, by status).
- Every EN page has its ES counterpart identified, or is flagged as having none.
- Every vi/zh URL has a proposed 301 target.
- Every linked anchor and every referenced document is inventoried.
- All popups and Mailchimp form instances documented.
- Report to `docs/reports/phase-01.md` with headline numbers and the questions I need to
  answer. PR open on `phase-01-audit`.

Stop when done and wait for me.
