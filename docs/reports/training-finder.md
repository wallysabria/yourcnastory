# Training finder

## Delivered

Added a bilingual Earn and Learn finder after the complete Path Option II / Self-Funded content on `/cna-training-providers/` and its existing Spanish counterpart `/es/programa-cna-2/`, preserving page copy, metadata, URLs, original partner spreadsheet link and the self-funded/CDPH resources. Search by ZIP/ZIP+4 with 10/25/50/100-mile radius; combine facility keyword, city and county filters. Results sort by approximate straight-line distance when ZIP is supplied, alphabetically otherwise. Show nine at a time; Call and external Directions actions on each card.

The single maintained public dataset contains 71 facilities from the owner-supplied workbook. Source sheet, row numbers and workbook SHA-256 are retained. Census batch geocoding produced 66 address-range matches and five non-unique/unmatched addresses; those five use their ZIP-area representative point with an explicit distance note, as approved. No source street addresses were changed. Three county corrections and Delta Oaks Post Acute's owner-confirmed phone correction retain their original values and separate approval/evidence records.

## Verification

- Repeatable XLSX import: 71 complete public records, unique IDs, ZIP+4 preserved; no workbook modification or raw workbook committed.
- Build validation: 71 records; 33,791 national Census ZCTA representative points; location ranges/phone formats/unique IDs and correction approvals; matching EN/ES keys and placeholders. Invalid datasets fail the production build.
- `npm run lint`: passed.
- `npm run format:check`: passed.
- `npm run content:verify`: all 47 active page records passed. Incidental regenerated historical parity reports were not included in this change.
- `npm run build`: passed, including TypeScript and the new facility-data validation.
- `npx playwright test tests/training-finder-unit.spec.ts tests/training-finder.spec.ts tests/routing.spec.ts tests/seo.spec.ts tests/content.spec.ts`: 37 passed. Includes independent distance reference, radius/order and combined filtering, corrected counties, ZIP+4, malformed/unmapped/distant ZIPs, network failure/retry, fallback-location note, expansion/clear, original links, existing source metadata and content, routing, external-link handling and all imported media.
- English/Spanish keyboard and responsive checks at 1440, 768, 390 and 320px: passed, no horizontal overflow; controls have 44px-or-larger targets.
- axe WCAG 2 A/AA and 2.1 AA scan scoped to the finder: zero violations in all eight language/width combinations. This does not claim whole-site accessibility sign-off.
- Browser network test: no visitor ZIP/keyword transmitted; searches use a fixed same-origin coordinate asset; no new external requests or finder localStorage. Directions contain the facility address only.
- Visually inspected local EN/ES desktop and mobile captures, stored under ignored `_source/training-finder/screenshots/`.

## Data and operational limits

Dataset is a partner list, not a verified current-enrollment directory or comprehensive list of California programs. Visitors must contact facilities about training availability and requirements. County/address geography checks do not establish program status or validate every contact number. ZCTAs are statistical areas and do not cover every USPS ZIP (for example some PO-box-only ZIPs); unknown ZIPs show city/county fallback guidance. Distances are from the entered ZIP area's representative point and are not driving distances. No exact visitor location is requested or retained.

Uses Census 2025 Gazetteer ZCTA representative coordinates, Census Public_AR_Current / Current_Current batch address matching, and the owner-approved source list. No paid map service, database, API key or new runtime package. The ZIP asset is about 1.05 MB uncompressed and fetched only on the first valid ZIP search; browser/server compression and caching apply. It is not embedded in the initial page payload.

New Spanish strings are logged for native-language review; implementation approval does not close the paused Spanish/privacy sign-off. Chatbot/database setup and privacy review are excluded.

Maintenance steps: `docs/reports/training-finder-maintenance.md`. Preview and PR links will be supplied with the review handoff; this branch is not production-published until merge approval.

## Owner-approved final placement — 2026-11-20

Moved the finder below the complete Path Option II block, including Facility-Based, Alternative Online-Based and Community-Based resources, in both languages. Owner approved merge/publication with this adjustment. PR: https://github.com/wallysabria/yourcnastory/pull/27 .
