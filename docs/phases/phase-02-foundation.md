# Phase 2 — Foundation

**Purpose:** the app skeleton every page will sit on — framework, routing for both
languages, design tokens, global layout, redirect engine and quality checks.

---

## Prompt

This is **Phase 2: foundation**. Re-read `CLAUDE.md`, the approved Phase 1 outputs in
`docs/audit/`, and `docs/reports/phase-01.md`. Start in **Plan Mode**; in the plan, propose
the architecture (folders, routing approach, content schema, libraries with a one-line
justification each) and wait for my approval.

### Inputs
- `docs/audit/url-manifest.*`, `redirects-proposed.csv` (as approved), `design-reference.md`,
  screenshots
- `_source/brand/` (logos, font notes) — if missing, use the live site's assets as
  referenced in the audit and flag it

### Do in this phase
1. **Next.js app** (App Router, TypeScript strict), static generation by default,
   trailing slashes on. Lint, format and type-check scripts.
2. **Routing from the manifest.** English at root, Spanish under `/es/` with the exact
   translated slugs. Routes are generated from a single typed **slug map** derived from the
   manifest — no hand-typed URLs in components. A helper returns a page's counterpart in
   the other language (for the switcher and hreflang).
3. **Content schema** (types + validation) for: standard pages, the career path collection,
   testimonials, global settings (announcement bar, menus, footer), and page metadata
   (title, description, canonical, robots, OG). Design it so a CMS could be dropped in
   later. **No real content yet** except what's needed to render the layout.
4. **Design tokens and base styles** matching `design-reference.md`: fonts (self-hosted,
   `font-display: swap`), colors, type scale, spacing, breakpoints, buttons, links, focus
   states (visible and AA-compliant).
5. **Global layout** for both languages: header with mega menus, mobile menu, language
   switcher (EN/ES only, pointing to the counterpart page), announcement bar (content-driven),
   footer, skip link, back-to-top. Match the live site at desktop and mobile.
   - **All Employers links are inactive** per `CLAUDE.md` §4.5 — controlled by one feature
     flag (e.g. `EMPLOYERS_ENABLED=false`) so they can be switched on in Phase 8 without
     hunting through components. Inactive = visually unchanged, not clickable, not
     announced as a link to screen readers, excluded from sitemaps.
   - Placeholders for search and chat entry points (built in later phases).
6. **Redirect engine** driven by a data file built from the approved
   `redirects-proposed.csv` (vi/zh, slashless, old slugs). 301 status. Tested.
7. **Metadata helpers**: per-page title/description/canonical/OG/hreflang (EN↔ES +
   `x-default`), all from content data. **Previews and any non-production deployment send
   `noindex`.**
8. **Quality gates** in CI (GitHub Actions) and as local scripts: type-check, lint, build,
   internal link checker, a redirect test that runs every row of the redirect file, an
   axe accessibility smoke test on the layout.
9. **Search and uploads spikes (findings only):**
   - Confirm Pagefind works with this build setup on Vercel, including language-scoped
     results and PDF indexing. Report whether PDFs are straightforward or not. Don't build
     the search UI yet.
   - Propose how `/wp-content/uploads/` files will be served so exact paths keep working
     (for whatever subset we decide on), and how optimized images will be handled.
10. **Vercel**: propose the project setup (production branch `main`, preview deployments
    per PR, environment variable names). Make changes only after I approve them.

### Not in this phase
No page content, no Mailchimp, no analytics, no chatbot, no Employers pages.

### Acceptance criteria
- Preview deployment renders the global layout (EN and ES) visually matching the live site
  on desktop and mobile; side-by-side screenshots in the report.
- Language switcher maps correctly for every manifest pair (tested).
- Every redirect in the approved file passes the redirect test.
- Employers links are inactive via one flag (tested both ways).
- Preview responses include `noindex`.
- CI is green. Report to `docs/reports/phase-02.md`, including the search/uploads findings.

Stop when done and wait for me.
