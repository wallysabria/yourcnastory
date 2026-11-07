# Phase 0 report — Orientation and environment

Date: 2026-11-07 · Branch: `phase-00-orientation`

## What was done

- Confirmed understanding of `CLAUDE.md` and the phase process (summary below).
- Ran read-only access checks on GitHub, Vercel and local tooling.
- Inventoried `/_source/` and read the plugins screenshot.
- Set the repo visibility per owner decision (public — see `docs/logs/decisions-needed.md`).
- Created `main` with an initial `.gitignore`-only commit (the repo was empty), then built the
  working structure on `phase-00-orientation`: `.gitignore`, `.gitattributes`, `CLAUDE.md`
  (unchanged), `docs/phases/`, `docs/review-checklist.md`, `docs/reports/`, `docs/audit/`,
  `docs/recommendations/`, `docs/logs/` templates, `README.md`.

## Understanding (summary)

- **Goal:** move yourcnastory.org from WordPress/Elementor to static Next.js on Vercel — same
  look and behavior, every URL preserved, stronger SEO/AEO. Not a redesign.
- **Non-negotiables:** every EN/ES URL and anchor ID resolves (trailing slashes; vi/zh → 301
  to English); uploads never deleted or renamed; English ported verbatim; job board removed
  everywhere and logged, never replaced; design changes only once approved; WCAG 2.1 AA and
  good mobile Core Web Vitals; no secrets or `/_source/` in git; no WP admin login; no live
  form submissions; previews `noindex` with no production analytics.
- **Spanish freeze:** character for character; only job-board removals allowed; anything odd
  is logged, never fixed.
- **Employers gate:** Career Seekers first. Homepage employer blocks render but their links
  are inactive, as are Employers menu items. No Employers pages or bot until the owner
  approves in chat. Both sections launch together.
- **Roadmap:** 0–7 Career Seekers + homepage + shared → ⛔ approval → 8–9 Employers →
  10 QA → 11 cutover.

## Concerns / proposed `CLAUDE.md` edits (not applied)

1. **Repo is public** (owner decision). Implication: reports, audit files and logs are
   world-readable. Proposed §4.8 addition: "The repo is public — no personal data, client
   contact details, credentials, or live-site security observations in any committed file."
2. **Analytics (§5):** Site Kit by Google and the Microsoft Clarity plugin are active, likely
   injecting GA4/Clarity outside GTM. Proposed: Phase 5 tag audit explicitly checks for
   duplicate GA4/Clarity tags before the new GTM container is built.
3. **Consent (§5):** Complianz is installed but inactive — the live site may have no consent
   banner. The new banner is new behavior, not a port; copy needs counsel.
4. **Forms (§5):** Fluent Forms (+ Pro) and MetForm are active, plus MxChat Form Collection.
   Proposed: add "any Fluent Forms / MetForm forms found in the audit" to §5, with handling
   decided per form.
5. **Redirects (§4.1):** Quick Page/Post Redirect is inactive and Yoast Premium is
   unlicensed; existing redirects may only be in the DB dump. The dump is therefore a
   Phase 1 input, not optional.
6. **Theme parity (§4.6):** The7 custom post types (Projects, Clients, Team members,
   Reviews) may have public URLs; Simple Custom CSS & JS holds custom code; Page Scroll to ID
   defines anchor scroll behavior/offset. All belong in the Phase 1 audit.
7. **Search (§5):** Pagefind does not index PDFs natively; PDF results need a text-extraction
   step at build time.
8. **Canonical host:** `www.yourcnastory.org` 301s to `https://yourcnastory.org/`. Proposed:
   state the apex as canonical in §1.
9. One live-site security observation was shared with the owner directly (not recorded in
   this public repo).

## Access checks

| Check | Command | Result |
|---|---|---|
| GitHub auth | `gh auth status` | Logged in as `wallysabria`; scopes `repo`, `workflow`, `read:org`, `gist` |
| Repo access | `gh repo view wallysabria/yourcnastory --json viewerPermission,isEmpty` | `ADMIN`; repo was **empty** (no `main`) |
| Push | `git push -u origin main` | Succeeded |
| Vercel CLI | `vercel --version` | **Not installed** — project/link status unknown |
| Node | `node -v` | v24.14.1 |
| npm / pnpm | `npm -v`, `pnpm -v` | 11.11.0 / 11.5.3 (yarn not installed) |
| git / gh | | 2.53.0 / 2.97.0 |
| Canonical host | `curl -sI` on apex and www | apex 200; www → 301 → apex |

### Proposed Vercel setup (awaiting approval — Q-007, Q-008)

1. Install the Vercel CLI (`npm i -g vercel`); owner runs `vercel login`.
2. One project `yourcnastory`, imported from GitHub via the Vercel Git integration;
   framework Next.js; production branch `main`; every branch push → preview URL.
3. Previews: Vercel's default `X-Robots-Tag: noindex` on preview domains, plus app-level
   `noindex` when `VERCEL_ENV !== 'production'`; Deployment Protection on.
4. Plan tier is an owner decision (Hobby is non-commercial; client work likely needs Pro).

## `/_source/` inventory

| Item | Expected path | Status | Needed by |
|---|---|---|---|
| WordPress export (WXR) | `_source/wordpress/export.xml` | ✅ 11.0 MB (2026-11-07) | Phase 1 |
| Plugins screenshot | `_source/wordpress/plugins.png` | ✅ 1080×5243 | Phase 1 |
| Database dump | `_source/wordpress/database.sql` | ❌ missing | Phase 1 (redirects, forms, custom CSS/JS, popups) |
| Uploads | `_source/uploads/` | ❌ missing | Phase 1 (inventory), Phase 3 |
| Logos (SVG) + fonts | `_source/brand/` | ❌ missing | Phase 2 |
| Mailchimp setup | `_source/integrations/mailchimp/` | ❌ missing | Phase 4 |
| GA4 + Clarity IDs | `_source/integrations/ids.md` | ❌ missing | Phase 5 |
| Tag audit | `_source/integrations/tag-audit/` | ❌ missing | Phase 5 |
| Chatbot sources / test set | `_source/chatbot/` | ❌ to be defined | Phase 6 |
| Search Console exports | `_source/seo/` | ❌ missing | Phase 7 |

## Plugins (from `plugins.png`)

40 installed · 32 active · 8 inactive · plus 1 must-use and 1 drop-in (not named in the
screenshot; likely SiteGround caching). WordPress 7.1.4.

| Plugin | Ver. | Status | What it does for the site | Phase |
|---|---|---|---|---|
| TranslatePress – Multilingual | 3.3.9 | active | EN/ES (+ retired vi/zh) translation, translated slugs, switcher. **Assumption confirmed.** | 1–3 |
| TranslatePress – Personal | 1.7.3 | active | Pro add-on (multiple languages, SEO slugs) | 1–3 |
| Yoast SEO | 28.8 | active | Titles, meta, sitemaps, schema. **Assumption confirmed.** | 1, 7 |
| Yoast SEO Premium | 25.7.1 | active, licence not activated | Redirect manager, extra schema | 1, 7 |
| MxChat | 3.2.27 | active | Current chatbot. **Assumption confirmed.** | 6, 9 |
| MxChat Form Collection | 1.2.20 | active | Collects form data inside chat | 6 |
| MxChat Multi-Bot Manager | 1.0.12 | active | Separate bots (likely Career Seekers / Employers) | 6, 9 |
| MxChat Theme Customizer | 2.1.6 | active | Chat widget styling | 6 |
| Elementor | 4.3.6 | active | Page builder; popups. **Assumption confirmed.** | 1–4 |
| PRO Elements | 4.3.2 | active | GPL Elementor Pro features (popups, theme builder, forms) | 1–4 |
| The7 Elements | 2.7.13 | active | Theme CPTs (Projects, Clients, Team members, Reviews), theme builder | 1–2 |
| The7 White-Label Tool | 1.0.1 | active | Admin branding only | — |
| DynamicConditions | 1.7.5 | active | Shows/hides Elementor widgets conditionally | 1, 4 |
| Fluent Forms / Fluent Forms Pro Add On Pack | 6.2.17 / 6.1.18 | active | Form builder — usage unknown | 1, 4 |
| MetForm | 4.3.4 | active | Elementor form builder — usage unknown | 1, 4 |
| Page scroll to id | 1.7.9 | active | Smooth scrolling / offsets for anchor links | 1, 4 |
| Simple Custom CSS and JS | 3.55 | active | Custom CSS/JS snippets (may include tracking) | 1, 2, 5 |
| Post Types Order | 2.5.9 | active | Manual ordering of posts/CPTs | 3 |
| SVG Support | 2.6.3 | active | SVG uploads/inline SVG | 3 |
| Site Kit by Google | 1.191.0 | active | Google services; likely GA4 tag outside GTM | 5 |
| Microsoft Clarity | 0.10.37 | active | Clarity tag via plugin | 5 |
| Debloat, Speed Optimizer, WP Meteor | — | active | Performance (not ported) | — |
| Security Optimizer, SiteGround Central | — | active | Hosting/security (not ported) | — |
| WPvivid Backup, WP File Manager PRO, Source Lens, Duplicate Page, Yoast Duplicate Post | — | active | Admin tools (not ported) | — |
| Complianz GDPR/CCPA Cookie Consent | 7.5.7 | **inactive** | Consent banner — not running | 5 |
| Quick Page/Post Redirect | 5.2.4 | **inactive** | Redirects — check DB for stale rules | 1 |
| GA Google Analytics, Hotjar | — | inactive | Old tracking | 5 (confirm no leftover tags) |
| Autoptimize, Lazy Load, WP Rocket, Regenerate Thumbnails | — | inactive | Not used | — |

**Assumption check:** translation = TranslatePress ✅ · SEO = Yoast ✅ · MxChat ✅ ·
Elementor popups ✅ (via PRO Elements) · forms: Fluent Forms + MetForm (new) · redirects:
none active (Quick Redirect inactive; Yoast Premium unlicensed).

## Verification against acceptance criteria

| Criterion | Evidence |
|---|---|
| Understanding + concerns | Sections above |
| Access checks | Table above |
| `/_source/` inventory | Table above |
| Plugin list with notes | Table above |
| `/_source/` ignored | `git check-ignore -v _source/wordpress/export.xml _source/wordpress/plugins.png` → matched `.gitignore:2:/_source/` |
| `git ls-files` shows nothing from `/_source/` | See PR description (run after final commit) |
| PR open | See PR link |

## Preview URLs

None — no app and no Vercel project yet (by design for Phase 0).

## Open issues, risks, decisions

See `docs/logs/decisions-needed.md` (Q-001 – Q-011). Most urgent for Phase 1: **database dump
and uploads** (Q-011 redirects, Q-010 forms depend on the dump).

## What Phase 1 needs

- `_source/wordpress/database.sql` and `_source/uploads/`.
- Approval to crawl the public live site (read-only) for the URL inventory.
