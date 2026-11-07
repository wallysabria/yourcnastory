# CLAUDE.md — YourCNAStory.org Migration

> Read this file in full at the start of every session. It is the project's standing rules.
> Phase-specific instructions arrive separately (see `/docs/phases/`). If a phase prompt ever
> conflicts with this file, **stop and ask** — do not pick one yourself.

---

## 1. Project brief

- **Site:** https://yourcnastory.org — the Certified Nurse Assistant Program (CNAP), run by
  Quality Care Health Foundation (QCHF), a California 501(c)(3).
- **Audiences:** two sections — **Career Seekers** (people exploring a CNA career) and
  **Employers** (long-term care facilities / SNFs).
- **Current stack (being retired):** WordPress + Elementor + plugins (translation plugin,
  likely TranslatePress; SEO plugin, likely Yoast; MxChat chatbot; Elementor popups).
- **Goal:** migrate to a modern, statically generated Next.js site on Vercel, with the
  **same look and feel**, **every URL preserved**, and stronger **SEO and AEO**
  (answer-engine optimization).
- **This is not a redesign.** Subtle improvements are allowed only when they deliver a
  tangible benefit and are logged for approval (see §4.6).

## 2. Stack

- **Framework:** Next.js (current stable, App Router), TypeScript (strict), static
  generation by default.
- **Hosting:** Vercel. **Repo:** https://github.com/wallysabria/yourcnastory
- **Content:** lives in the repo as MDX/JSON. **No WordPress, no headless CMS.** Structure
  content (typed schemas, one file per page/entry, frontmatter for metadata) so a CMS could
  be added later without a rebuild.
- **Search:** static index built at deploy (Pagefind unless a phase proves it unworkable).
- **Chatbot:** Claude via the Anthropic API, called only from server-side routes.
- Propose any other library in your plan with a one-line justification. Prefer fewer,
  well-maintained dependencies.

## 3. Languages

- **English** at the root (`/…/`) and **Spanish** under `/es/` with **translated slugs**
  (e.g. `/employers/` ↔ `/es/empresarios/`). The EN↔ES slug mapping comes from the source
  data and must be preserved exactly.
- **Vietnamese (`/vi/`) and Chinese (`/zh/`) are retired.** They used English slugs, so:
  - `/vi/<path>/` and `/zh/<path>/` → **301** to `/<path>/`
  - `/vi/` and `/zh/` → **301** to `/`
  - If the English page doesn't exist → 301 to the closest existing parent page.
  - Remove all vi/zh hreflang, sitemap entries, language-switcher items and form options.

## 4. Non-negotiables

### 4.1 URLs
- Every existing English and Spanish URL must resolve on the new site with the **same
  path and slug**, or 301 to its intended destination per the approved URL manifest.
- **Trailing slashes everywhere.** Slashless versions 301 to the slashed version.
- **Anchor IDs are URLs too.** Section IDs used in deep links (e.g.
  `/employer-resources/#dsd-approval`, `/community-resources/#practice-exam`) must exist
  on the new page with the identical ID.
- `/faqs/` and `/frequently-asked-questions/` are **two different pages**, not duplicates.
  Never merge pages or consolidate URLs without explicit approval.
- Some `/wp-content/uploads/...` paths must be kept exactly. Which ones is **not yet
  decided** — treat this as a decision gate (§7). Until decided, assume every document
  (PDF, DOCX, XLSX, etc.) keeps its exact path, and never delete or rename an upload.

### 4.2 Spanish copy is frozen
- Port all Spanish page copy **character for character**. Do not edit, correct,
  "improve" or retranslate any Spanish text — including typos, punctuation and
  inconsistent terminology.
- **One exception:** remove job-board references (§4.4). Log every such removal.
- New Spanish **interface** text the rebuild needs (search results messages, form
  validation errors, cookie banner, chatbot UI, etc.) may be added. Log every new string.
- Anything that looks off in Spanish → record it in `docs/logs/spanish-review-log.md`
  (page URL, exact text, what looks off). Logging never changes the site. Native
  speakers on the team will review the log later.

### 4.3 English copy
- Port verbatim. No rewriting, tightening or "SEO improvements" to copy without explicit
  approval. SEO/AEO content suggestions go in a recommendations file, never straight into
  the site.

### 4.4 Job board is gone
- `jobboard.yourcnastory.org` no longer exists. Remove **every** reference — links,
  mentions in copy (English and Spanish), metadata and chatbot knowledge. **Do not replace**
  removed links with anything. Log each removal in `docs/logs/content-changes-log.md`.

### 4.5 Employers section is gated
- Build **Career Seekers first.** Do **not** port, build or publish Employers content
  until the project owner explicitly approves it in chat. Pending content edits may change
  it.
- The **homepage is ported in full** (including its employer blocks, as they appear today),
  but **all links and buttons pointing into the Employers section are inactive** until
  approval. The same applies to Employers items in the header, footer and menus.
- Employers pages include: `/employers/`, `/cnap-awards/`, `/cusp-upskilling/`,
  `/cna-certifications/`, `/faqs/`, `/employer-resources/`, `/cnap-employer-signup/`, and
  their Spanish equivalents, plus anything the audit tags as Employers.
- The **employer chatbot** is gated behind the same approval.
- Both sections go live together at launch. Nothing ships as "coming soon".

### 4.6 Design
- Match the current site's look, layout and behavior by default (desktop and mobile).
- Any deliberate visual or layout change must have a stated benefit (performance,
  accessibility, SEO, clarity) and be logged in `docs/logs/design-changes-log.md` as
  **proposed**. It ships only after it's marked **approved**.
- Known fixes already approved: remove the viewport setting that blocks pinch-zoom; fix the
  Mailchimp form overflowing its section.

### 4.7 Accessibility and quality
- **WCAG 2.1 AA** is a requirement, not a goal.
- Core Web Vitals should be in the "good" range on mobile for every template.

### 4.8 Security and data
- **Never commit secrets.** API keys go in Vercel environment variables and a local
  `.env.local`, which is gitignored. Provide `.env.example` with names only.
- **`/_source/` holds the raw exports** (WordPress XML, database dump, uploads, screenshots)
  and is **gitignored. Never commit anything from it.** The database dump contains personal
  data (emails, password hashes, form entries) — read only what the task needs and never
  copy personal data into the repo, logs or reports.
- **Do not log in to the live WordPress admin.** Work from the exports and public crawls.
- **Never submit live forms** (Mailchimp, Microsoft Forms) with test data. Use a test
  audience or tag, or mocks, as agreed in the relevant phase.
- Non-production deployments (Vercel previews) must send `noindex` and must not load
  production analytics.

## 5. Integrations (summary — phases hold the detail)

- **Analytics:** Google Tag Manager set up **from scratch** (not ported). It must reuse the
  **existing GA4 property and Microsoft Clarity project** so historical data continues.
  The old container ID on the live site is `GTM-TLC2T6FQ` (reference only).
- **Consent and privacy (California):** consent banner with equally weighted
  Accept/Decline; analytics and Clarity blocked until consent; Google Consent Mode v2 and
  Clarity consent wired through GTM; honor Global Privacy Control signals; persistent
  "Privacy choices" link in the footer; privacy policy updated (including chat logging) —
  final copy reviewed by the client's counsel.
- **Mailchimp:** the signup form is rebuilt as **one reusable native component** posting to
  a server route that calls the Mailchimp API. Fields: First Name*, Last Name*, ZIP Code*,
  Email*, SMS Phone (optional, with the SMS consent disclosure **ported verbatim**),
  Language Preference* (**English, Español only**). Audience, merge fields, tags and groups
  must map exactly to the existing Mailchimp setup.
- **Microsoft Forms:** the employer application embed (`/cnap-employer-signup/`) — approach
  deferred; default is to keep the embed as-is (Employers phase).
- **Site search:** site-wide, results scoped to the visitor's current language, PDFs
  included if straightforward.
- **Chatbot (replaces MxChat):** one chat engine, two configurations — **Career Seekers**
  (launch) and **Employers** (launch, gated per §4.5). Bilingual, answers grounded only in a
  consolidated knowledge base, at most 2 paragraphs, with safeguards, PII-redacted session
  logs (12-month retention), an internal review page and in-chat Mailchimp signup. The
  knowledge base is built **from scratch**, not ported from MxChat.

## 6. How we work

1. **One phase at a time.** Phase prompts arrive one by one. Never start the next phase on
   your own, and never do work belonging to a later phase "while you're there".
2. **Plan first.** At the start of each phase, use Plan Mode: read the phase prompt, inspect
   the repo and inputs, and present a plan. **Wait for explicit approval** before changing
   anything.
3. **Small, reviewable steps.** Work on a branch per phase (`phase-XX-short-name`), commit in
   logical units with clear messages, and open a PR to `main` at the end of the phase. Each
   push produces a Vercel preview for review.
4. **Verify, don't assume.** Every claim in a phase report (pages ported, URLs matched,
   tests passing) must be backed by a check you actually ran. Show the command or output.
5. **End-of-phase report** (in chat and saved to `docs/reports/phase-XX.md`):
   - what was done
   - verification results against the phase's acceptance criteria
   - preview URL(s) to review
   - open issues, risks and decisions needed
   - what the next phase will need
6. **Keep the logs current:** `docs/logs/spanish-review-log.md`,
   `docs/logs/content-changes-log.md`, `docs/logs/design-changes-log.md`,
   `docs/logs/decisions-needed.md`.
7. Be concise in chat. Put detail in files.

## 7. Stop-and-ask triggers

Stop and ask the project owner — do not guess — when:
- a URL would change, be removed or be consolidated
- any Spanish text would change (other than job-board removal)
- English copy would change
- you're about to touch anything in the Employers section before approval
- a design change isn't already in the approved log
- an input you need is missing from `/_source/` (list exactly what's missing)
- source data conflicts (e.g. the WordPress export says one thing, the live site another)
- a deferred decision is reached:
  - which `/wp-content/uploads/` paths must be kept exactly
  - Microsoft Forms approach
  - whether a Spanish version of `/faqs/` exists
  - chatbot knowledge-base sources and refresh schedule
  - Anthropic account ownership and model choice
  - chatbot test question set
- a task needs a paid service, a new account or a DNS change
- anything is irreversible

## 8. Phase roadmap

| # | Phase | Section |
|---|-------|---------|
| 0 | Orientation and environment | — |
| 1 | Audit and inventory | Whole site (read-only) |
| 2 | Foundation | Global |
| 3 | Content extraction | Career Seekers + homepage + shared pages |
| 4 | Templates, pages, form, search | Career Seekers + homepage + shared pages |
| 5 | Analytics, consent, accessibility, performance | Global |
| 6 | Career Seekers chatbot | Career Seekers |
| 7 | SEO and AEO | Career Seekers + shared |
| ⛔ | **Owner approval required to start Employers** | |
| 8 | Employers content and build | Employers |
| 9 | Employers chatbot + SEO/AEO | Employers |
| 10 | Full-site QA and parity | Whole site |
| 11 | Launch cutover and monitoring | Whole site |

**Shared pages** (built with Career Seekers): header, footer, announcement bar, search,
privacy policy, homepage. `/frequently-asked-questions/` belongs to Career Seekers;
`/faqs/` belongs to Employers.
