<!-- Owner explicitly approved implementation and allow-search/discovery, block-model-training policy in chat on 2026-11-08. -->
# Phase 7 plan — SEO/AEO (approved 2026-11-08)

Prepared 2026-11-08. Owner approved proceeding to Phase 7 while explicitly deferring Phase 6. This document records the approved implementation plan. Implementation is now complete for review; see docs/reports/phase-07.md. Branch phase-07-seo-aeo starts from published Phase 5 main (7ec7e686f5df405add69960b5315c1db94cbd272). Career Seekers, homepage and shared pages are in scope; Employers remain gated. Existing body copy, source URL paths, visual design, D-004 decision, disabled live tracking and staging noindex remain in force.

## Inputs and priorities

The supplied performance/indexing Excel workbooks are now present in ignored `_source/seo/`. Intake: docs/audit/phase-07-search-console-inputs.md/.json. Performance spans 2025-07-07–2026-11-06, with 332 pages and 1,000 query rows. Indexing snapshot ends October 22 and provides reasons/counts without affected-URL examples. Query/page aggregates differ and are not a paired dataset. Do not claim exhaustive queries, exact query-to-page attribution or URL-level indexing diagnoses.

Prioritize preservation of /es/programa-cna/, homepage, /certified-nurse-assistant-program/, /what-is-long-term-care/ and /community-resources/. Reconcile every exported URL, including translated retired paths, uploads and Employer traffic. Employer demand informs later-phase notes only. No chatbot unanswered logs exist; do not invent that input.

## 1. Metadata and language preservation

Audit all 48 renderable URLs against the approved Phase 3 metadata records, with a read-only source cross-check where necessary. Verify title, description, canonical, source robots directives and OG title/description/image/type/locale/URL. Record differences between current source and frozen records instead of silently choosing new wording. Preserve metadata text; proposed title/description improvements belong only in recommendations.

Final-domain canonicals must self-reference the intended preserved route, never redirects, retired languages or the Vercel review host. Keep reciprocal EN/ES and x-default links with trailing slashes; verify targets and locale coverage. Preserve necessary launch-mode robots semantics (including advanced source directives where supported), while unlaunched/previews continue noindex/nofollow headers and robots disallow. Technical production-mode checks run in an isolated local build/configuration; do not enable the public launch gate just to test them.

Read the installed Next metadata, robots/sitemap and route-handler guides before implementation. Account for duplicate head tags, social-image URL resolution, malformed/case-sensitive metadata and redirected targets. No source body copy changes.

## 2. Sitemaps and lastmod

Add sitemap index and separate EN/ES XML page sitemaps, generated from the same validated route/gating manifest. Include only eligible canonical URLs, not redirects, retired languages, gated Employers, internal APIs, query URLs or missing documents. Each language entry has reciprocal alternates where supported. XML parser/URL checks use existing tools; no new runtime library is proposed.

Use trustworthy per-page modification dates from source provenance or content-significant history, with a recorded derivation. Never stamp every page with the build/current date. Omit lastmod where no reliable evidence exists and report that exception. Source modification time, extraction time and deployment time are different facts. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Robots references the final-domain sitemap index in launch configuration. Previews stay disallowed even if sitemap endpoints are available for QA. Document sitemap inclusion is **not proposed initially**; verify exact-path document preservation first and seek separate inclusion approval later. No Search Console submission or DNS/cutover in this phase.

## 3. Search Console URL reconciliation and documents

Build a report table for all 332 exported page rows: stable row ID, sanitized path/parameter keys, locale/scope, impressions/clicks, source status, migration status, hop count, approved target and disposition. Keep raw query values only in ignored inputs. A row without a match is not automatically a 404; test exact rules, encoded variants and authorized retired-language fallback behavior.

For in-scope traffic pages: preserve 200 at the same path or an approved single-hop 301 ending in a real 200. Validate query handling, slash variants, loops/chains and final canonicals. Do not silently activate deferred redirects, consolidate /faqs/ with /frequently-asked-questions/, redirect unrelated historical demo pages to homepage, or change Spanish slugs. Newly discovered ambiguous URL dispositions become a concrete approval batch with source evidence before activation. Existing authorized vi/zh counterpart policy still applies; gated Employer targets remain explicit exceptions until that phase.

Reconcile Search Console upload paths with the existing document/upload inventories. Preserve exact Career Seekers document paths and externally referenced original image paths where in scope, including byte hash/type/status checks; retain any existing derivatives separately. Do not publish Employer forms/assets as a back door around the section gate. Record those obligations for the Employer phase. Preserve all existing document names; missing originals require public-source retrieval or owner input, not fabricated files.

Source-probe 403 responses currently affect the migration-host homepage as well as upload paths. Treat as a request-verification limit, not proof that a particular PDF is broken. Use throttled/backoff checks and controlled browser/deployment verification without weakening security settings.

## 4. Structured data with visible evidence

Use server-rendered, safely serialized JSON-LD (escape '<', no raw script injection), shared helpers and route-specific facts. Proposed graph: Organization for the visible QCHF/CNAP relationship, WebSite, WebPage, existing-navigation-based BreadcrumbList and FAQPage on the Career Seekers FAQ in EN/ES from the exact existing Q&A. Preserve the distinction between QCHF as the organization and CNAP as its program/brand; do not invent legal identifiers, addresses, affiliations or eligibility claims.

Breadcrumb labels/hierarchy must be supported by existing navigation/page labels; no invented parents or new breadcrumb row. If a valid implementation requires new visible navigation, prepare a separate visual proposal before shipping. FAQ content must match accessible visible accordion answers character-for-character after documented whitespace/markup normalization; exclude the gated Employer FAQ.

Use Occupation on career pages only when the visible page describes that occupation; use informational WebPage/ItemList for general training resources/directories. EducationalOccupationalProgram/Course is appropriate only where a discrete actual program/course and its provider are visibly supported. CNAP resource pages must not be falsely presented as a training school/course provider. Never add invented salary, enrollment dates, prices, credentials, reviews, ratings or JobPosting. [Occupation](https://schema.org/Occupation), [program type](https://schema.org/EducationalOccupationalProgram).

Validate syntax, schema types/property ranges, required supported fields, source visibility, language, URL resolution and graph IDs automatically; check representative graphs with Schema.org Validator. Use Google's testing only for currently supported result features and report tool limitations, not a fabricated all-types rich-results pass. FAQPage remains a schema type, but Google retired FAQ rich results in May 2026. Keep requested semantic markup without promising rich-result eligibility. [Schema FAQPage](https://schema.org/FAQPage), [Google update](https://developers.google.com/search/updates).

WebSite SearchAction must point to a **working** language-aware search URL, not a dialog button or invented endpoint. Proposed technical addition: support the source-style `?s=` URL with the existing Pagefind search dialog, preserving language/results/clearing/focus. Mark search-query responses noindex and canonicalize to the base route; never include raw search text in telemetry. This adds URL-addressable behavior to the existing interface, without a new visual design. Reuse current UI strings, and test no-script/page content remains crawlable. If the source uses a different verified search URL, use that supported URL instead; no fake SearchAction target. Google's sitelinks search box has been retired, so this is semantic functionality, not a ranking/rich-result promise. [Google announcement](https://developers.google.com/search/blog/2024/10/sitelinks-search-box).

## 5. Semantic HTML and AEO

Check actual DOM heading tags as well as ARIA roles: one H1 and logical headings per page, source text unchanged. Correct native tag semantics while preserving existing CSS appearance/spacing, anchors and responsive behavior; compare screenshots/computed layout for affected templates. Any deliberate visible change needs a separate concrete approval, not an automatic SEO rewrite. Identify existing question headings and answer passages; recommendations may suggest improvements but do not modify them.

Build llms.txt with a factual site description and links to eligible canonical key pages, excluding Employers/private endpoints. Reuse approved metadata where suitable. It is not an access-control or permission file and does not replace robots/noindex. Google states no special AI text file is required for Search; no ranking/AI-citation guarantee. [Google AI guidance](https://developers.google.com/search/docs/appearance/ai-features).

Crawler policy is an owner decision. **Recommended launch policy: allow search/discovery crawlers, block explicitly identified model-training crawlers.** Verify each vendor's current user-agent and control semantics before implementation. Offer alternatives: allow all public crawlers, or also block AI discovery. Keep all crawlers disallowed during staging regardless of the chosen future policy; explicit bot groups must not accidentally override staging '*' disallow. Robots is voluntary crawler guidance, not authentication. No private content becomes public under this policy. Do not change Googlebot visibility/AI-search behavior by misrepresenting separate training controls.

## 6. Content recommendations only

Deliver docs/recommendations/seo-aeo-content.md with page-level priorities based on supplied clicks/impressions, plus query themes clearly marked as inferred associations without page-query data. Address missing answers, unclear summaries/titles, thin pages, FAQ gaps, internal linking and alt-text issues. Use existing query aggregate populations correctly; topic buckets overlap and cannot be summed as unique traffic.

Draft suggested edits in English only. Flag Spanish opportunities for native speakers; do not rewrite Spanish titles/descriptions/answers. Do not apply any recommendation to frozen body copy. Maintain a separate later-Employers opportunity list without porting its content. Record that no chatbot evidence exists because Phase 6 is deferred.

## 7. Verification and delivery

- All 48 in-scope metadata/head/hreflang checks; launch and noindex configurations independently verified.
- Sitemap XML/index/alternates/date provenance and gate exclusions; no retired/noncanonical URLs.
- Every supplied traffic row accounted for with evidence, including explicit Employer/unresolved dispositions. Missing issue-URL examples remain a report limit; no blanket all-property indexing-health claim.
- Exact-path in-scope document/image checks and unresolved Employer obligations recorded.
- JSON-LD automated/representative validator evidence; source visibility and no unsupported facts. Rich-result eligibility is separate from schema validity.
- Crawlable static HTML, actual H1/headings, query-search behavior, consent/tracking gates, unchanged body copy/anchors, accessibility and screenshot checks for affected native semantics.
- Required lint/typecheck/format/build, focused SEO tests and existing regression suite. No paid service/new runtime dependency proposed.
- Update all four logs; save phase-07.md and raw validation evidence; commit logical units and open Phase 7 PR/protected preview. No merge, live indexing, Search Console account changes, DNS/cutover, chatbot or Employers implementation without authorization.

## Approval requested

Approve this plan (including functional source-style search URLs, preserved source content and documented acceptance limits), and choose the future AI-crawler policy. Newly discovered ambiguous redirects, document scope conflicts and deliberate visual changes still require their own concrete approvals. Document sitemap inclusion is deferred by default. Additional indexing-issue URL exports and page-query detail would improve diagnosis but are not required to begin the approved technical work.

Implementation detail: use the existing Next-provided build-time PostCSS parser to adapt type selectors for corrected heading tags without changing selector specificity. Original source CSS files remain untouched; derived bundles are compared against 96 desktop/mobile reference views. No new runtime dependency.
