# Career-detail SVG text cleanup

Owner approved removing leaked technical SVG CSS from the eight English and eight Spanish career-detail pages on 2026-11-10. The two exact artifacts differ only in stroke: currentColor or grey. The allowlist in content/migration/svg-text-cleanup.json scopes normalization to those 16 URLs. This is a separate correction, not a new phase.

Removed 266 occurrences from page text nodes. Inventory text/link labels and character/content hashes were refreshed together. Exact before/after block-tree comparisons prove only these substrings changed. Metadata, destinations, images, anchors, background/embeds and every other character remain unchanged. No CSS, arrow styling or layout changes. Search rebuild now indexes cleaned content. Raw source snapshots stay untouched. Source extraction and parity comparisons apply the same approved cleanup to prevent reintroduction without suppressing unrelated copy differences.

The original live HTML contains these rules in SVG style definitions; affected rendered snapshots contain them as visible text. That establishes the artifact's origin, not which theme/plugin update caused it. No WordPress admin login or original-site repair was performed.

Verification: npm run content:verify — 48/48 PASS against captured source with the approved exception; npm run lint; npm run build; npm run format:check; npx playwright test — 70/70 PASS. All 16 pages at desktop 1440px and mobile 390px (32 views) have no leaked class text and no document overflow, return 200/noindex, and retain clean link labels. Four EN/ES screenshots: career-svg-cleanup/. Checks: career-svg-cleanup.json, career-svg-cleanup-rendered.json and career-svg-cleanup-tests.json. No live forms or tracking activated.

PR: https://github.com/wallysabria/yourcnastory/pull/12

Protected Vercel preview: https://yourcnastory-6dydktz36-wallysabrias-projects.vercel.app/careerpaths/careers-in-certified-nurse-assistant/

Preview build status is reported by the PR Vercel check; the 32-view browser checks above ran against the local production build. Normal preview authentication remains enabled. No temporary access credentials were created. No merge/publication or phase advancement. Existing Employers/chatbot/indexing/integration gates remain in force.
