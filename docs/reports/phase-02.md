# Phase 2 — Foundation

## Delivered

Next.js 16.4.5 / React 19.3.1, strict TypeScript, validated Zod content contracts, static App Router shells, shared EN/ES navigation/footer, self-hosted Manrope and source brand assets. A single slug map holds 59 structural records; 48 Career/shared routes render layout shells. Article/page bodies await Phases 3–4. Eleven Employers paths have structural records only and cannot render. Employers navigation destinations are inactive through one flag; both flag states are tested. Search and chat have placeholders only. No forms, analytics or chatbot are active.

The manifest retains unimplemented URLs as reserved records. The redirect engine activates 250 deterministic slash/retired-language mappings with explicit HTTP 301 and query preservation. All 172 unresolved proposals remain inactive, including through fallback; see phase-02-redirects-deferred.json. No legacy/demo URL disposition or missing language pair was guessed.

## Verification

Local lint, typecheck, format check, production build and audit consistency validator passed. Playwright: 24 passed, zero failed/skipped/flaky (phase-02-tests.json). Tests cover every active redirect over HTTP, all 48 route languages/canonicals/noindex, reciprocal counterpart pairs, deferred redirects, known navigation destinations, Employers gating, desktop keyboard menus, phone dialog/focus and tablet navigation. Twelve axe layout smokes across EN/ES home, Career and training routes at desktop/phone reported zero violations. This is a smoke test, not full WCAG certification or final visual parity. Full npm audit and production-only audit reported zero vulnerabilities. ESLint 9 matches the installed Next plugin peer range; its deprecation is a tooling follow-up.

Visual comparisons: [local side-by-side gallery](phase-02-visual/index.html), EN/ES at 1440px and 390px, header/footer only. Sixteen JPEGs stay local/ignored; index and capture script are committed. Footer captures suppress fixed header/skip overlays only for screenshot clarity. Layout uses the measured 1024px mobile-menu breakpoint; live announcement bar is disabled. Main body imagery/context and complete parity await page builds.

## Search and uploads findings

Pagefind 1.6.0 indexed all 48 prerendered shells in two languages. Browser queries returned matching-language results and slash-terminated URLs. Next's prerendered .html output must be staged into route/index.html directories for correct result URLs. A real Career/shared PDF was staged but was not indexed by the HTML CLI: PDF support requires text extraction plus custom records or HTML surrogates. This is a findings-only isolated spike, not deployed search UI/index; see phase-02-search-spike.json. CI also runs the spike to check Linux compatibility. Upload serving proposal: ../recommendations/uploads-serving.md.

## Vercel and review

Owner selected the existing wallysabrias-projects Hobby team and authorized project setup. Created yourcnastory, linked GitHub repository, Next.js framework / Node 24, production branch main, branch previews, provider authentication protection retained. No DNS/custom-domain cutover or paid upgrade. Environment names: EMPLOYERS_ENABLED, SITE_LAUNCH_APPROVED; VERCEL_ENV is provider supplied. Previews always send noindex; production also remains noindex until explicit launch approval. Raw exports, .env files and docs/test artifacts are excluded from deployment.

Review: [PR #3](https://github.com/wallysabria/yourcnastory/pull/3), [protected branch preview](https://yourcnastory-git-phase-02-foundation-wallysabrias-projects.vercel.app/), [verified immutable deployment](https://yourcnastory-nyt3pkoae-wallysabrias-projects.vercel.app/). Cloud checks passed all 250 HTTP 301 mappings and all 48 HTTP 200 route shells, including language/noindex/no production analytics. Unauthenticated access returned 302 to authentication. Sanitized evidence: phase-02-cloud-checks.json.

Cloud verification caught Vercel's adapter inferring static slash shape only from a 308 redirect. The pinned adapter is accommodated by a host-restricted route-shape hint for reserved routing-shape.invalid; actual requests continue to use the tested 301 data. vercel.json mirrors the redirect file, with equality checked in the suite and generation kept synchronized. Recheck all cloud redirects after framework/adapter upgrades. Optional local Vercel adapter build could not complete on Windows (cmd.exe spawn); local Next build and the real Linux cloud deployment passed.

[Foundation CI](https://github.com/wallysabria/yourcnastory/actions/runs/42398080858) and [audit CI](https://github.com/wallysabria/yourcnastory/actions/runs/42398080869) validate this implementation; final PR checks also cover subsequent report-only updates. The automation bypass credential created by Vercel CLI for authenticated checks is revoked after verification; no credential is in the evidence.

## Open items and next phase inputs

Missing database.sql, uploads archive and brand package remain accepted source limitations. Logos/font were sourced publicly and provenance recorded. Review the 172 deferred redirects, legacy/demo scope, nonreciprocal language pairs, seven source 404s and upload path decision before affected content is implemented. The source mobile/desktop Employers FAQ discrepancy is retained in inert menu data; /faqs/ and /frequently-asked-questions/ remain separate. Native Spanish review remains pending. Phase 3 needs the approved content scope and source reconciliation; no Phase 3 work has started.

