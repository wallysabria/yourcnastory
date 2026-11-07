# Phase 3 — Content extraction

## Result

48 approved pages extracted (24 EN / 24 ES), with 16 career-path entries and 20 structured homepage testimonials. Content lives in content/pages/*.json, with typed ordered semantic nodes, exact DOM-decoded text, source widget identifiers, anchors, links, image alt text, metadata and decoded video configuration. The index/static loader align filenames and routes. Homepage employer blocks are preserved under the explicit exception; no Employers page is extracted or renderable.

Q-023: owner approved rendered live copy and punctuation as authoritative; WXR cross-checks structure/metadata. Script/style infrastructure, decorative SVG internals and the retired chatbot are excluded from main-page content scope. Global navigation remains the Phase 2 implementation. Form copy/options are inert reference data for Phase 4.

## Evidence

Commands run: node scripts/verify-content.mjs --live; node scripts/check-visible-content.mjs; npm run lint; npm run typecheck; npm run format:check; npm run build; npx playwright test.

Fresh source parity: 48/48 passed, including normalized text, exact character stream, ordered link destinations, image count/alt records, anchors, all seven metadata fields and agreement with logged removals. See phase-03-parity.csv and phase-03-parity.json. All 24 Spanish character streams match after five logged removals. Source whitespace/punctuation is retained; the character proof does not rely on whitespace normalization.

Browser-visible source-text coverage: 48/48 passed, no unmatched text after the logged removals (phase-03-browser-source-checks.json). Collapsed/offscreen copy is additionally retained by static character checks. This is content coverage, not final layout or interaction parity.

475 image instances and 670 scoped content anchors retained. Ten job-board removals total (five per language), replacing nothing. Mixed privacy-policy paragraphs lose only exact retired-service substrings; unrelated website statements remain. Evidence: phase-03-jobboard-removals.json and content-changes-log.md. No other copy rewritten; no new Spanish UI strings.

WXR SEO cross-check: 24 original-language records, 44 fields, 42 exact matches and two OG image resolution variants (homepage and Community Resources). Export names resized derivatives; live plugin serves originals. Retained current served values, already used in Phase 2. Spanish pages have no separate translated WXR records. See phase-03-wxr-crosscheck.json.

## Media

344 assets imported (25,904,605 bytes), including lazy/srcset variants, inlined CSS backgrounds, source video and metadata images. All have source URLs, referencing pages, local paths and SHA-256 hashes in content/media/manifest.json. No extracted internal image lacks a mapping. Files use descriptive names in public/images/content/. Source URLs remain recorded: this does not approve retiring historical upload paths at cutover.

The selected current pages reference zero WordPress-upload documents. Eight unique external document URLs retain their existing hosts/paths, without replacements (phase-03-external-documents.json). The importer preserves exact /wp-content/uploads/... paths for any documents encountered. Missing full uploads archive still prevents historical-upload completeness claims.

## Review renderer and quality

/api/content-review/?path=/ and /api/content-review/?path=/es/ are clearly labeled content diagnostics, not new page templates. Links have no navigation targets; forms are disabled fieldsets; embeds do not execute. CSP blocks scripts, frames and submissions; all responses send noindex. Unknown/Employers/filesystem paths return 404. Public page bodies remain the Phase 2 shells. No forms, search, analytics or chatbot implemented.

27 local Playwright tests passed, zero failed/skipped/flaky. Tests include all 48 review URLs, all 344 asset HEAD responses/byte lengths, restricted review scope, and existing 250 redirects, EN/ES metadata, menus and 12 zero-violation axe layout smokes. Lint, typecheck, format and production build passed. Evidence: phase-03-tests.json.

Preview/PR/final CI links follow deployment. PR #3 remains open: automatic approval review rejected merging the foundation into main without explicit merge/deployment approval. Phase 3 is a separate branch based on that foundation; main is unchanged.

## Reproduction and next phase

Node 24 / npm ci. Run npm run content:capture to refresh the 48 approved public snapshots into ignored _source/phase-03/; npm run content:extract; npm run content:media; npm run format; npm run content:verify:live; npm run content:visible (requires Playwright Chromium). npm run content:verify is the offline CI gate using committed source signatures/inventories, and local snapshots when available. Canonical JSON hashes allow formatting without disguising copy changes.

All four logs are updated. Inherited source issues/unknown legacy scope remain deferred. Missing database/uploads/brand inputs remain accepted limitations. Phase 4 requires its own plan approval, then source-matching templates, interactions, native form and search. Keep source anchors, document paths, frozen Spanish, Employers gate and noindex/analytics restrictions. Remove diagnostic endpoint before launch when no longer needed. No DNS/paid-service change; Phase 4 has not started.
