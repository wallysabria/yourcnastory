# Phase 7 — SEO and AEO review

Implementation is ready for review on `phase-07-seo-aeo`. Not merged or launched. Phase 6 remains deferred; Employers remain gated.

## Delivered

- Source-backed metadata and Open Graph fields across 48 English/Spanish pages, reciprocal hreflang, canonical URLs and authentic archived modification dates. Frozen body copy and anchors preserved.
- XML sitemap index and EN/ES sitemaps: 16 eligible pages total. The source's 32 noindex pages remain excluded; changing those directives is a separate content decision. llms.txt likewise excludes those pages.
- Source-backed Organization, WebSite, WebPage, BreadcrumbList, FAQPage and Occupation graphs without invented provider, salary or course claims. FAQ answers match rendered content.
- Real heading tags with preserved appearance, working bilingual `?s=` search URLs, exact-path original uploads (18 files), and approved FAQ/retired-language redirects. All 260 active redirect rules have HTTP tests.
- Approved eventual crawler policy: allow discovery, block four documented training controls. Staging still blocks indexing. Vendor controls are voluntary and Google-Extended also affects Gemini grounding; see crawler-policy.md.
- Search Console inventory/reconciliation and draft recommendations only; no unapproved copy edits.

## Verification

- `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`: passed.
- `npx playwright test`: 59 passed, including all 260 actual redirect responses, metadata, structured data, search and consent mocks.
- 48 rendered body/anchor parity checks passed; 48 archived HTML hashes unchanged.
- 96 controlled desktop/mobile heading comparisons: zero changed pixels or geometry differences. Evidence: phase-07-heading-parity.json.
- 192 accessibility states: 112 clear, 80 retain only the owner-declined D-004 contrast/link exceptions. No overflow. Evidence: phase-07-accessibility.json. This is not a WCAG conformance claim.
- Isolated launch build: 48 metadata/crawler checks passed, search-query noindex and alias redirect verified; staging build restored. Evidence: phase-07-launch-mode.json.
- Schema.org validator: home, EN/ES FAQ and career graphs each returned zero errors/warnings; payload hashes and screenshots saved in phase-07-schema-validation.json/folder. Schema validity does not promise search rich results.
- Protected Vercel checks: see phase-07-cloud-checks.json for exact deployment/SHA, all 48 pages, 552 assets, bilingual search, consent mocks and SEO endpoints. Temporary test credentials are revoked after verification; preview authentication stays enabled.

## URL acceptance and limits

All 332 supplied Search Console page rows are accounted for: 173 accepted and 159 explicit exceptions, with evidence in phase-07-search-console-urls.csv/json. Exceptions include 27 Employer URLs, five deferred document paths, 13 retired counterparts outside the current build, 81 historical theme/demo/review URLs, 32 unresolved historical dispositions and one retired job-board URL. These are not silently redirected to the homepage. This phase does not establish whole-property URL preservation or launch readiness.

The two MOU attachments have ambiguous inventory parent references and remain scope-review obligations alongside Employer forms/partnership documents; none is published here. The indexing workbook has aggregate reasons without affected-URL examples; query exports lack page-query pairs. Recommendations acknowledge these limits. Source noindex overrides require review before any change.

## Review / next steps

Review PR https://github.com/wallysabria/yourcnastory/pull/7 and the verified protected preview https://yourcnastory-npt65qy2s-wallysabrias-projects.vercel.app (runtime SHA 5bb73df2afa3ddb375bc649f5f11e07328752f8e). Final protected checks passed, including all eight approved counterpart rule variants with query preservation; temporary test access was revoked. The public `yourcnastory.vercel.app` alias remains Phase 5 pending explicit merge/publication approval. No DNS, Search Console account changes, production tracking, live form submissions or chatbot activation.

Future gates: review unresolved URL/document dispositions, source noindex choices, recommendations and existing Phase 5 accessibility/performance/counsel/live-integration exceptions. Employers require explicit authorization; Phase 6 is deferred. No next phase has started.
