# Phase 7 intake — SEO/AEO

2026-11-08. Owner approved proceeding to Phase 7 and explicitly deferred Phase 6. Chatbot planning remains preserved on phase-06-chatbot-career-seekers; no chatbot implementation, database/account or paid API calls were started. This branch starts from published Phase 5 main, not the deferred Phase 6 branch.

## Required input missing

`_source/seo/` does not exist. Phase 7 requires Search Console pages/queries for the last 16 months and the indexing report. Its prompt explicitly says: “If missing, stop and tell me — prioritization depends on it.” No traffic-based ranking, redirect coverage or recommendation priority can be claimed without these inputs. No Phase 7 implementation has begun.

Requested input: relevant property name (domain or URL-prefix), export date/date range, performance page and query data (including page-query relationships if available), and indexing report/export. Keep originals in ignored `_source/seo/`. Do not paste credentials or private query data into chat. Search Console's exports may be truncated; document coverage/limits and do not imply an export accounts for every traffic URL if rows are missing.

## Current read-only observations

- Existing metadata uses source title/description/OG records and final-domain self-canonicals; reciprocal EN/ES/x-default alternates are generated.
- Current migration alias is deliberately noindex, nofollow/noarchive with robots disallow; Phase 7 must not enable indexing or perform launch cutover.
- Robots currently has no sitemap declaration; sitemap index/per-language routes and structured data are Phase 7 work, not yet implemented.
- Technical preservation, documents, metadata parity, sitemap lastmod provenance, JSON-LD, semantic checks, llms.txt and an owner-decided AI-crawler policy require a concrete plan before implementation.
- Source copy remains frozen. Employers remain gated. Chatbot unanswered logs do not exist because Phase 6 is deferred; no such evidence may be invented for recommendations.

After the missing inputs arrive: inspect coverage, inventory known source/metadata gaps, consult current primary search/schema guidance, propose the implementation/crawler policy and obtain plan approval. No new service, account, external publication or content change is inferred from this intake.

## Inputs received — 2026-11-08

The owner supplied performance and indexing XLSX workbooks in the Migration folder. Originals are now copied unchanged into ignored _source/seo/. The missing-input gate above is resolved; workbook coverage/limits are documented in docs/audit/phase-07-search-console-inputs.md/.json. Proposed implementation plan: docs/phases/phase-07-plan.md. Implementation and crawler-policy approval remain pending.
