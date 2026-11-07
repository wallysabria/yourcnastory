# Phase 1 — Audit and inventory

Date: 2026-11-07 (America/New_York). Branch: phase-01-audit.

## Outcome

Read-only audit completed for available export/public sources, with **conditional coverage** approved by the owner. This is not approval to start Phase 2. Phase 0 PR #1 was merged first (merge d470770f17a90ec6869ef5e07d57ac109037c45c). No website code, content port, live redirect, form submission, WordPress admin login, analytics change or Employers build occurred.

## Evidence totals

| Measure | Observed |
|---|---:|
| Discovered/crawled URLs | 331 |
| English / Spanish / Vietnamese / Chinese | 89 / 83 / 80 / 79 |
| HTTP 200 / 301 / 404 | 200 / 124 / 7 |
| Career Seekers / Employers / shared / other | 102 / 27 / 9 / 193 |
| Sitemap URL rows | 74 |
| WXR total / published public content records | 588 / 68 |
| Media/attachment candidates checked by HEAD | 793 |
| Document candidates | 17 |
| Exported attachments not linked in audited HTML | 229 (unreferenced status unverified) |
| Redirect proposals / retired-language proposals | 422 / 244 |
| EN HTTP-200 URLs with no declared/discovered ES counterpart | 2 |
| EN URLs whose declared ES counterpart is not HTTP 200 | 30 |
| Initial full-page screenshots / distinct pages | 114 / 57 |
| Missing references among classified Career Seekers/shared EN+ES pages | 0 |
| Known published popup templates | 4 |

Counts include legacy/theme/demo pages and slashless/translated variants; they are not a launch page count. Repeated global links and translated pages create repeated observations. `other` is explicitly awaiting owner classification, not excluded. Job-board link/text records can overlap and must not be interpreted as unique prose occurrences.

### Source counts

- wxr:careerpaths: 8
- wxr-body: 32
- crawl: 325
- hreflang: 288
- redirect: 40
- wxr:page: 32
- sitemap: 74
- wxr-menu: 15
- seed: 1
- wxr:the7_project: 10
- wxr:the7_client: 8
- wxr:the7_reviews: 10

Row-level intersections/exceptions are in docs/audit/source-reconciliation.csv. Membership overlaps, so source counts do not sum to the unique URL total.

## Main findings and decisions

1. Translated vi/zh slugs exist. Owner approved using declared English counterparts for redirect proposals; no redirects applied.
2. Preserve the exact EN/ES slugs, including /es/programa-cna-2/. /faqs/ and /frequently-asked-questions/ remain distinct. No Spanish /faqs/ counterpart is declared in available sources; absence is not proven.
3. Spanish Employers landing/resources paths currently redirect, rather than presenting Spanish counterparts. Review Q-015 before any extraction/build.
4. Mobile Employers FAQ target differs from desktop (Q-016). Source untouched.
5. The7 demo projects/clients/archives, testimonials with standalone URLs, legacy campaign pages, train-and-gain and employer calculator need disposition (Q-014). No deletion/consolidation approved.
6. Exact form fields/placements and EN/ES SMS disclosure captured. Fluent Forms appears on train-and-gain. No live tests. Full audience tags/groups/SMS setup still requires owner input.
7. Extra advertising tags observed; later approved tag plan must decide their fate. Public IDs are observations, not verified account ownership.
8. Seven existing 404s and other metadata/anchor/alt issues are logged. Desktop ArrowDown did not expand the sampled menu; hover-open screenshot was not obtained. This is an observation for later accessibility review, not a completed audit.

## Verification actually run

- `node --check scripts/audit.mjs`, `node --check scripts/enrich-audit.mjs`, `node --check scripts/finalize-audit.mjs`.
- `node scripts/audit.mjs <repo-root>`: robots-aware public GET crawl and media HEAD checks; cached responses retain observation timestamps.
- `node scripts/enrich-audit.mjs <repo-root>`: forms/widgets/metadata, resolved anchor evidence, language/section flags, proposed redirects, design/integration/issue artifacts.
- `node scripts/finalize-audit.mjs <repo-root>`: inventories, screenshot signature/dimension verification, summary/logs/report.
- Browser: 1440×1000 desktop and 390×844 mobile viewports, EN/ES; mobile menu, search popup, FAQ expansion, empty chat shell, employer Microsoft Forms iframe. No form/chat submission.
- `node scripts/validate-audit.mjs <repo-root> --local`: final results recorded in docs/audit/validation-results.json.
- `git check-ignore`, `git ls-files _source` and staged-file review before commit.
- `npm run lint` / `npm run build`: **not applicable** in Phase 1; no package.json/app by explicit phase scope. Audit scripts receive syntax/inventory validation instead.

## Acceptance status

| Criterion | Status / evidence |
|---|---|
| Every available-source URL reconciled | Observed sources complete for crawler scope; database/query-only URLs excluded and documented. |
| EN/ES pairing | language-pairs.csv; missing/non-200/nonreciprocal pairs flagged. Not all pairs are healthy. |
| Every observed vi/zh URL has proposed target | Validator checks every observed retired-language row; method owner-approved, destinations still proposed. |
| Linked anchors/documents | anchors.csv, documents-inventory.csv; PDF outgoing links/CSS asset completeness remain limitations. |
| Popups/Mailchimp instances | form-instances.json, popup-settings.json, integrations.md; conditional completeness unverified without DB. |
| Desktop/mobile reference coverage | screenshot-verification.json; classified in-scope pages checked; legacy decision pages also sampled. |
| Report/logs/PR | Report and four logs updated; Phase 1 PR opened at handoff. |

## Limits and outstanding inputs

- Owner approved proceeding without database.sql and uploads archive on 2026-11-07
- No database-only translation/slug/redirect/settings coverage
- No complete filesystem/unreferenced-upload inventory
- HEAD verifies status/declared size, not binary integrity or outgoing PDF links
- CSS background/font assets inventoried separately in observed CSS evidence; not exhaustively HEAD checked
- Runtime conditional popup completeness cannot be proven
- Query URLs recorded but not crawled; WordPress search/admin exclusions respected
- Screenshots are initial rendered references; dynamic/lazy content is nondeterministic
- Employer content audited only; none ported or built

Also missing: brand/font licence files (Phase 2), Mailchimp audience setup (Phase 4), GA4/Clarity IDs plus tag audit (Phase 5), chatbot sources/test set/account/model/storage decisions (Phase 6), Search Console exports (Phase 7).

## Preview and handoff

No Vercel preview: this phase deliberately contains no app or deployment. Review the PR's data/docs and local image references in docs/audit/screenshots/. Binary references are ignored; their filenames/dimensions/timestamps are committed. No new hosting account, paid plan or DNS changes.

Before Phase 2: approve/resolve URL and section decisions, redirects, incomplete input coverage, Spanish counterpart questions, font/assets and Vercel setup. Full WCAG/visual parity/Core Web Vitals claims belong to later built-site checks.

## Audit consistency CI

A dependency-free Node validator runs on the committed snapshot through GitHub Actions. The only workflow action is official actions/checkout@v7.0.1 (release verified through the GitHub API); it checks out the snapshot so the validator can run. Raw exports, browser sessions, screenshot binaries and network crawling are not needed in CI. This checks artifact consistency, not website parity.
