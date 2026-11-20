# Regional Earn and Learn consolidation

Owner-approved scope: retire regional English and Spanish landing pages for Los Angeles, Central Valley, Bay Area, Northern California and San Diego. All ten canonical paths, slashless variants and legacy regional aliases redirect permanently to `/earn-and-learn/` (English), as requested. The general Spanish `/es/earn-and-learn/` remains available.

Removed the ten page records, imports and active slug-map entries. Search rebuilt with 47 pages instead of 57; sitemap generation uses the same active route map. No remaining regional hrefs were found in active content/pages or content/global. Preserved original uploads, historical SEO/audit evidence and the paused chatbot artifacts.

Validation:
- `npm run lint`: passed.
- `npm run build`: passed, including TypeScript and search generation (47 pages, EN/ES).
- `npx playwright test tests/routing.spec.ts --project=unit`: 10 passed, including actual HTTP 301/location checks for every activated redirect, chain-free routing, reciprocal language pairs and new regional-removal coverage.
- Initial routing run exposed differing ordering between Vercel and application redirect lists. Regenerated Vercel rules from the canonical manifest; rerun passed.

Review-only change pending merge/publication. Privacy/content sign-off remains paused and is not included in this branch.
