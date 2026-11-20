# Standalone training finder

Owner-requested revision of the existing finder, on branch `codex/standalone-training-finder`.

## Behavior

- Dedicated English `/find-a-training-facility/` and Spanish `/es/encuentra-un-centro-de-capacitacion/` pages, titled "Find a Training Facility" / "Encuentra un centro de capacitación".
- Remove the embedded tool from the two existing training-provider pages, preserving their informational sections and the old `#training-finder` anchor at the partner-link section.
- Replace all 9 active page links to the specified partner spreadsheet by matching its ID, irrespective of sharing parameters/fragments. English pages link to English; Spanish to Spanish. Preserve link wording, remove external-window behavior for these internal links, and keep unrelated Google documents untouched. Remove the obsolete spreadsheet download-tracking entry.
- Add Earn and Learn-only filtering and card badges. All 71 current entries are true per owner confirmation. Future true/false/unknown classifications are explicit and required during import; unknown records never receive the badge or pass the affirmative filter.
- Retain local ZIP/radius, city, county and name search; ZIP fallback labels, public call/directions links, corrections and data provenance; no new service or dependency.
- Register the new pages in active routing, reciprocal languages, canonical metadata, structured data, sitemaps and search. New page content is marked as owner-approved new content; it is not presented as migrated WordPress copy. The approved spreadsheet normalization is also applied when checking archived source snapshots, so verbatim text checks remain intact.

## Verification

- `npm run lint`: passed.
- `npm run format:check`: passed.
- `npm run content:verify`: all 49 page records passed (47 existing plus two explicitly new pages). Existing page text is unchanged; only the approved link destinations/window behavior change.
- `npm run build`: passed, including TypeScript and validated program classifications. Search now indexes 49 pages in two languages; new routes are present in sitemap and metadata checks.
- `npx playwright test tests/training-finder-unit.spec.ts tests/training-finder.spec.ts tests/routing.spec.ts tests/content.spec.ts tests/seo.spec.ts`: 39 passed.
- Earn and Learn tests use true/false/unknown fixtures; unknown and false never pass the affirmative filter. Current dataset: all 71 explicitly true.
- All active page links were checked: no remaining anchors to the partner spreadsheet; at least the nine affected pages now use same-tab finder URLs in their own language. Original provider pages have no finder or finder stylesheet; their three CDPH resources remain and the old deep-link anchor lands at the updated directory link.
- English/Spanish at 1440, 768, 390 and 320px: keyboard/controls, badge display, blue-header contrast, no horizontal overflow, and zero scoped axe WCAG A/AA violations.
- Visually reviewed EN desktop and ES mobile captures; screenshots remain ignored under `_source/training-finder/screenshots/`.

Coverage Covers build/data validation, unchanged source copy on existing pages, all active spreadsheet hrefs, program filter with true/false/unknown fixtures, badges, language routes/canonicals, original-resource preservation, desktop/mobile keyboard/accessibility and visual captures. New Spanish interface wording is logged, with native review still pending separately from implementation approval.

Maintenance: `docs/reports/training-finder-maintenance.md`. Original privacy review and chatbot work remain paused and excluded. This change is prepared for review before merge/publication.

## Final header treatment — owner requested 2026-11-20

Replaced the initial white title/header treatment with the existing site-style blue gradient and layered-wave title banner, white logo/navigation/title in both languages, and the standard solid header after scrolling. Uses the original training-providers SVG asset and matching gradient. Finder controls/results remain below the banner; no new copy or service.

Final header verification: lint/build and formatting passed. `npx playwright test tests/training-finder.spec.ts tests/training-finder-unit.spec.ts tests/seo.spec.ts` passed all 24 tests after the blue-header update. Scoped axe coverage includes the finder, title banner and site header in EN/ES at 1440/768/390/320px. Desktop EN and mobile ES captures were visually reviewed against the requested reference.
