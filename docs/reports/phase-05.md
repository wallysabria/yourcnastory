# Phase 5 — analytics, consent, accessibility and performance

Status: implementation complete for review, with the explicit acceptance exceptions below. Revised plan/tag plan and D-005 were approved by the owner on 2026-11-08; D-006 click-to-load media was separately approved. Branch: phase-05-integrations. No Phase 5 merge, launch or Phase 6 work has been performed.

## Delivered

- Retained GA4 407144160 / G-RC2WSP3DYG, Clarity yr1ps67xpa, GTM-TLC2T6FQ, both observed Ads destinations, both Floodlight configurations and MNTN. Typed, sanitized event contracts and an owner configuration guide preserve these systems without inventing campaign/conversion mappings. No analytics account/container workspace was changed.
- Native EN/ES equal-weight Accept/Decline controls, separate necessary/analytics/advertising preferences, footer reopening, 180-day versioned storage, storage-error handling, GPC/DNT overrides, cross-tab withdrawal and expiry validation. All optional SDKs remain disabled in this migration; consent activates in-memory mocks only. Production mode requires every explicit server gate plus HTTPS and the approved real-domain hostname.
- D-006 external media: self-hosted original thumbnails; YouTube/Vidyard iframes load only after Play. Tests confirm no passive provider requests on either Community Resources page. Providers may process information after a user requests playback.
- Bilingual privacy-policy recommendations for counsel, including actual mock Mailchimp/SMS state and proposed future redacted chat/12-month retention. The published policy bodies remain unchanged. No chatbot exists in this phase.
- Accessibility/keyboard/reflow audit, nonvisual skip-link focus fix, stable mobile policy contents before hydration, WOFF2 delivery, exact-order CSS bundling and home fallback-image preload. Original source copy/media/font/license and URLs remain preserved.

## Verification

| Check | Result |
|---|---|
| npm run lint, typecheck, format:check, build | Passed |
| Full Playwright regression suite | 53 passed; mock submissions only |
| npm run content:verify | 48/48 passed |
| Rendered copy and anchors | 48/48 copy matches; no missing anchors |
| Full axe scan | 192 route/viewport/choice states; 112 zero, 80 retain only D-004 contrast/link failures |
| New consent UI axe | Zero violations, desktop/mobile |
| Policy post-fix axe | Four desktop/mobile EN/ES checks, zero violations |
| Template keyboard/names/reflow/reduced motion | 18 representatives across nine templates, passed within the recorded method |
| Font rendering / CSS cascade | Eight screenshot comparisons, zero changed pixels; exact ordered CSS bytes on 48 routes |
| Optional mock overhead | 54 fresh contexts; no extra scripts/external requests when granting optional categories |
| Hosted Lighthouse | 108 baseline + 54 after + six targeted policy reruns; all successful |
| Hosted performance budgets | Score >=90 on 14/18; LCP <=2.5s on 6/18; CLS <=0.1 and TBT <=200ms on 18/18 |
| Protected cloud preview | 48 pages, 534 assets, EN/ES search, mock signup and consent checked; temporary access revoked |
| Production dependency audit | Zero vulnerabilities (npm audit --omit=dev) |

Evidence is in phase-05-a11y.md, phase-05-performance.md, their raw JSON reports, phase-05-cloud-checks.json, phase-05-asset-parity.json and phase-05-mock-overhead.json. Reproduction helpers are in scripts/. Baseline/performance data stores metrics and sanitized resource paths, not authentication cookies or private query values. Generated CSS bundles intentionally preserve inherited whitespace.

## Acceptance exceptions and release gates

1. **Live vendor verification deliberately deferred by owner.** No GA4 DebugView/Tag Assistant, live Clarity or advertising-delivery claim. Owner export/reconciliation of exact Ads labels, Floodlight activity rules, MNTN advertiser details, linked Google tags and category-specific consent checks is required before any later activation. Do not set production gates merely because this PR is merged.
2. **D-004 remains declined.** Source contrast and color-only inline-link styling are retained. Zero-axe/WCAG AA acceptance is unmet; no conformance claim. Existing Phase 4 visual flags remain review items.
3. **LCP/score exceptions remain.** See each route's before/after medians. The new consent paragraph becomes LCP after hydration on two short-header English pages; other source/header critical paths also exceed the target. Both policy-page CLS regressions were fixed to zero. Lab TBT is not field INP; field p75 CWV and actual live-vendor overhead remain unavailable.
4. **Manual method limits:** Chromium keyboard/names and 1280/640/320 CSS-pixel equivalent reflow were checked. Actual OS screen-reader speech output and browser-menu zoom remain unverified. Editorial alt-quality review is logged separately.
5. **Counsel/owner review before release:** new consent wording and draft policy, actual entity/contact/rights/retention/vendor disclosures, and external-media notices. Existing policy text was not replaced. Spanish UI strings and draft text are logged for review.
6. Mailchimp remains mock-only pending the existing audience/merge-field/tag/SMS setup and approved live test destination. No live audience subscription or SMS was sent.

## Review and next step

The public https://yourcnastory.vercel.app/ alias remains Phase 4 until the owner approves merging this phase. The protected Phase 5 deployment and exact verified SHA are recorded in phase-05-cloud-checks.json; sign in to the owner's Vercel account to view it. All temporary automation access is revoked after verification; deployment authentication remains enabled.

Owner review/merge approval is the next action. Phase 6 requires its own approved plan and the Career Seekers knowledge sources, ownership/model/credential decisions, redaction/retention implementation requirements and test-question set. No Phase 6 work was started.

Verified review deployment: https://yourcnastory-o950o8nng-wallysabrias-projects.vercel.app (code SHA e2c9fe6a585008cba4f86cdf69bb6b6c4a4a8b2d). Final encoded first-party JavaScript: 200.94 KiB across 8 resources; includes JavaScript discovered by module preload.


## Phase 5 publication / Phase 6 planning — 2026-11-08

Owner explicitly approved merging/publishing Phase 5 and proceeding to Phase 6. PR #6 merged as 7ec7e686f5df405add69960b5315c1db94cbd272. Public alias https://yourcnastory.vercel.app/ verified for 48 pages/534 assets, EN/ES consent, retained vendor mocks, GPC and click-to-load media. Production tracking stays disabled; no DNS/custom-domain cutover. Evidence: docs/reports/phase-05-production-checks.json. Phase 5 acceptance exceptions remain recorded.
