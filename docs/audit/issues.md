# Existing-site observations — Phase 1

Read-only findings; nothing corrected or removed. Full rows: `issues.csv`. Missing alt attributes are distinct from intentionally empty alt text.

- missing-description: 116
- h1-count: 123
- pinch-zoom-blocked: 200
- existing-404: 7
- missing-alt-attribute: 45
- duplicate-title: 11
- missing-anchor: 524

Potential content/template duplicates and demo pages require owner decisions in `section-decisions-needed.csv`. IDs in Elementor action links are widget actions, not missing HTML anchors. Redirected anchor links were checked against the final observed page. HTTP-200 malformed paths can serve duplicate content; canonical fields remain recorded verbatim. No consolidation is approved.

## Phase 3 observations — retained source
- Career Nursing source uses “requre” in the displayed excerpt; retained verbatim, no correction.
- Two WXR OG image fields name resized derivatives while the live plugin serves originals (homepage and Community Resources). Current served metadata preserved; evidence: docs/reports/phase-03-wxr-crosscheck.json.
- External Drive resource documents remain on their original hosts. No local replacement or document URL change inferred.
- Native forms, conditional video playback, carousel behavior and full responsive parity are Phase 4 work; this extraction does not claim those interactions are rebuilt.

## Phase 5 review — 2026-11-08

- D-004 remains an explicit owner exception: source cyan/white text contrast and links relying on color remain. Automated AA acceptance is unmet; do not claim WCAG conformance.
- Descriptive alt text quality and empty decorative alt decisions remain source-content editorial review items. The native renderer always supplies an alt attribute; automated presence checks do not establish a good description in either language. No source alt wording was silently rewritten.
- Inline media passive third-party requests were observed on both Community Resources pages. Owner approved D-006: self-hosted original thumbnails and explicit Play before provider iframe creation. Requests after Play are user-requested external media, not proof of vendor privacy compliance.
- Native skip target lacked programmatic focus. Fixed with tabindex=-1 on the existing content target, with no visible design or copy change.
- OS screen-reader speech output and actual browser-menu zoom remain unverified; Chromium accessible names/keyboard and 1280/640/320 CSS-pixel reflow are recorded separately.
