# Phase 7 Search Console intake

Received 2026-11-08 from the two owner-supplied Migration-folder Excel workbooks. Originals were copied unchanged into ignored `_source/seo/`; SHA-256 hashes, sheet names/counts and sanitized metrics are in `phase-07-search-console-inputs.json`. Raw queries and tracking-parameter values are not copied into tracked reports. No workbook was modified.

## Performance coverage

- Filters: Web (text-based), Last 16 months.
- Chart: 488 daily rows, 2025-07-07 through 2026-11-06.
- Pages: 332 rows. Queries: exactly 1,000 rows. No page-query cross-tab is supplied; treat the query set as potentially truncated/non-exhaustive.
- Chart totals: 2,892 clicks / 570,363 impressions. Page aggregation totals: 2,923 / 617,463. Query aggregation totals: 700 / 273,171. These populations differ; do not force them to reconcile or substitute one denominator for another.
- Highest-click in-scope page: /es/programa-cna/ (951 clicks, 165,399 impressions). Other priorities include homepage, /certified-nurse-assistant-program/, /what-is-long-term-care/ and /community-resources/.
- Employers traffic is present and remains out of build scope. Historical /cnap-awards/, /cusp-upskilling/ and /faqs/ traffic does not authorize publishing those pages.

Initial evidence-only matching: 33 rows match built paths, 11 match gated Employers paths, 60 match approved exact redirect rules, 41 match reserved/unbuilt paths, 10 are upload paths and 177 are not exact matches. These are **not HTTP pass/fail classifications**: retired-language fallback rules, case/encoding variants, historical demo pages and source-status checks still need reconciliation. Do not report 177 broken URLs based on this lookup. Every exported row needs a disposition and verification evidence, including explicit gated/out-of-scope entries.

## Indexing coverage

The chart covers 2026-08-09 through 2026-10-22 (75 daily rows), despite the workbook export filename being dated November 8. Latest snapshot: 74 indexed / 244 not indexed. The issue counts reconcile to 244: 98 alternate canonical, 73 noindex, 33 redirects, 28 not found, 10 crawled/not indexed, one other 4xx and one forbidden 403. Two other issue rows have zero pages.

No affected-URL lists are present. These totals describe the existing WordPress property at the snapshot; they are not a diagnosis of the migration. Individual issue exports or URL Inspection evidence would be needed to attribute reasons to specific URLs. This does not block technical planning; coverage limits will be carried into the final acceptance report.

## Documents and request limits

Search Console lists seven PDF paths and three image paths under /wp-content/uploads/. Exact originals are absent at those paths locally. Some appear to be Employer forms/material and must remain gated until separately authorized; Career Seekers toolkits require exact-path preservation work. Do not treat a renamed image derivative as preserving an externally referenced original URL.

Read-only HEAD checks found the source originals returning 200 with PDF/image types. Migration-host probes returned 403, and a control GET to the homepage also returned 403 with Vercel-generated HTML. These responses may reflect request filtering; they do not isolate an upload-specific failure or establish what an ordinary browser sees. Stop repeated probes, retain security protections and re-verify under controlled deployment/browser conditions during implementation. No security settings were changed or bypassed. Raw check results remain ignored.

## Next action

Required exports are now present. Prepare and approve the Phase 7 implementation plan, crawler policy and detailed URL dispositions. Additional indexing examples are helpful for diagnosis, not grounds to invent per-URL findings. Phase 6 remains deferred.
