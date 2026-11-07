# Phase 7 — SEO and AEO (Career Seekers, homepage, shared pages)

**Purpose:** keep every ranking signal the site has, then strengthen how it's understood by
search engines and AI answer engines — without changing copy unless approved.

---

## Prompt

This is **Phase 7: SEO and AEO**. Re-read `CLAUDE.md` §4.1–4.3. Start in **Plan Mode** and
wait for my approval.

### Inputs
- `_source/seo/` (Search Console: pages and queries, 16 months; indexing report). If
  missing, stop and tell me — prioritization depends on it.
- Manifest, Phase 3 metadata, built preview.

### Do in this phase — preservation (implement)
1. **Metadata parity:** every in-scope URL's title, description, canonical, robots and OG
   data match the old site (automated check). Self-referencing canonicals; no canonical to
   a redirected URL.
2. **hreflang:** reciprocal EN↔ES pairs plus `x-default`; nothing for vi/zh. Validate every
   pair.
3. **Sitemaps:** per-language XML sitemaps (pages and, if approved, documents) with
   accurate `lastmod`; sitemap index; `robots.txt` pointing to them. Employers URLs excluded
   while the flag is off. Previews disallow indexing.
4. **Redirect validation against Search Console:** every URL with impressions or clicks in
   the last 16 months returns 200 at the same path or a single-hop 301 to the right page.
   No chains, no loops.
5. **Documents:** confirm every externally referenced document resolves at its exact path.

### Do in this phase — enhancement (implement technical, recommend content)
6. **Structured data (JSON-LD), validated:** `Organization` (QCHF/CNAP), `WebSite`
   (with search), `BreadcrumbList`, `FAQPage` on the FAQ page (from existing Q&A
   only), and appropriate types for career paths and training information. Only mark up
   content that is visible on the page. Both languages.
7. **AEO technical:** semantic HTML (one H1, logical headings), question-style headings
   identified, clear page summaries via existing metadata, `llms.txt` describing the site
   and key pages, crawler access policy for AI crawlers (propose; I decide), fast and
   crawlable HTML without client-side-only content.
8. **Content recommendations — do not apply:** in
   `docs/recommendations/seo-aeo-content.md`, prioritized by Search Console data: missing
   answers to high-impression queries, thin pages, title/description improvements,
   internal-linking opportunities, FAQ gaps (including any from chatbot "unanswered"
   logs). English only for drafting; Spanish suggestions flagged for native speakers.
9. **Image SEO:** descriptive filenames are not changed if paths must be preserved; alt
   text issues logged, not rewritten.

### Not in this phase
No copy changes, no Employers pages.

### Acceptance criteria
- Automated metadata, hreflang, sitemap and redirect checks pass for every in-scope URL.
- Every Search Console URL with traffic is accounted for (report table).
- Structured data validates with no errors.
- Recommendations file delivered for my review.
- Report to `docs/reports/phase-07.md`.

Stop when done. **Do not begin any Employers work** — that requires my explicit approval.
