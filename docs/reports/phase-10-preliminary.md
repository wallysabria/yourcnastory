# Preliminary Phase 10 QA — Career Seekers and shared pages

Status: preliminary QA review in progress. Both implementation defects below are fixed on the branch; final performance evidence and protected preview checks are being completed. Full-site acceptance and launch sign-off remain deferred.

## Scope

48 existing EN/ES Career Seekers/home/shared pages. Employers is English only and content remains pending; links stay gated. No Phase 6/9 chatbot work, Employer build, live submission/tracking, account change, DNS or indexing enablement. Approved plan: docs/phases/phase-10-preliminary-plan.md.

## Fixed

1. Fragment/query-only links were resolved against the source origin root, turning career section jumps into homepage links. Preserve these references against the current document. Two EN/ES nursing jump regression tests pass; copy/anchor IDs unchanged.
2. WebKit pointer activation does not focus buttons by default. Explicitly focus the Privacy choices/Manage preferences opener before opening the existing dialog so focus can return correctly. Consent wording, categories, storage and styles unchanged. Targeted regression added.

## Evidence

| Area | Measured result |
|---|---|
| Required quality checks | Lint, typecheck, format check, build passed |
| Chromium regression | 62 passed, including all 260 actual redirect responses and two new jump-link/one focus regressions |
| Archived content and rendered parity | 48/48 pass; no missing original source anchor IDs; archived hashes unchanged |
| URL/resource crawl | 48 pages, 2,854 active first-party link occurrences, 141 resource URLs; 11 broken legacy paths and three missing anchor destinations remain explicit |
| Source-backed proposals | Ten legacy redirect destinations verified on public WordPress; approval pending; one Spanish source-broken path has no chosen redirect |
| Extended browsers | 108 representative Edge/Firefox/WebKit checks pass (18 template/locale pairs × two widths × three engines); exact versions in browsers.json |
| Accessibility | 192 states: 112 zero violations; 80 retain only D-004 failures; no overflow |
| Keyboard / reflow | 18 template/locale representatives pass recorded keyboard/name/motion checks and 1280/640/320 CSS-pixel reflow |
| Visuals | 96 original-reference and 96 current-source comparisons completed; all original-reference views flagged; representative review and limitations saved |
| Job-board sweep | No reader-visible references across the built pages/metadata; two shipped PDFs text/URI scan clear; remaining source strings are removal-policy evidence |
| Production dependency audit | Zero reported vulnerabilities; pattern secret scan zero matches across 318 files, with explicit method limits |
| SEO / privacy | All 48 metadata/heading/graph checks and sitemap/query-search tests pass in regression; staging noindex preserved, optional SDKs mocked/off; source noindex overrides retained |
| Performance | 54 cold mobile runs in progress; medians and Phase 5 comparison will be attached |
| Public baseline | Published Phase 7 SHA recorded in published-baseline.json; branch contains the two QA fixes |

Each phase-10-preliminary JSON/report contains its stated method; raw source screenshots remain ignored. Machine-readable link failures are findings, not a claim of zero unexpected 404s. The inert public /api/content-review route is source-copy verification, not private chat data. Hosted headers and inactive proposals are recorded separately.

## Limits and handoff

See docs/reports/phase-10-launch-blockers.md for the consolidated decisions, retained exceptions and dependencies. Native Safari/iOS/Android, actual OS screen-reader speech, actual browser-menu zoom, field CWV and live integration verification remain unavailable/deferred. No WCAG, complete visual parity or whole-property preservation certification. Earlier Phase 7 launch-mode evidence remains applicable: this pass changes no indexing/crawler configuration; local/preview noindex is rechecked.

The Spanish handoff preserves exact logged/catalog wording without translating or editing the site. Counsel review is pending, not assumed. Report-only/header proposals do not enforce a new CSP. No new runtime dependency.

No-go for full launch. Review PR and protected preview when final evidence is attached; merge/publication requires owner instruction. Full Phase 10 and Phase 11 have not been completed or started respectively.
