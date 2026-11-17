# Phase 8 continuation — remaining English Employer pages

## Scope and decisions

Owner approved current public-site versions of /employers/, /train-and-gain/ and /advocate/ while later editorial changes remain pending. English only. The three pages join the existing six approved Employer pages; the hold list is empty. Spanish Employer counterparts remain reserved/unbuilt. Chatbot/database and live integration activation remain deferred.

Train and Gain’s WordPress inquiry form is explicitly a placeholder by owner request (D-023). Current fields remain visible as disabled reference content, with “Form preview only — submissions are not available yet.” No form POST or new backend integration exists. This does not replace or alter the existing Microsoft Forms application or Mailchimp signup.

## Implementation

- Captured the three current public pages into ignored source snapshots; extracted verbatim copy/punctuation, metadata, anchors and media into repo content.
- Promoted Train and Gain and Advocate from audit reservations into real Employer route records, preserving paths. Activated all three through the shared release allowlist for page rendering, navigation, homepage links, search and sitemaps.
- Retained source page layout and existing reusable carousels, source-link/new-tab rules and consent behavior. Imported the original circular portrait mask, and fixed whitespace-padded CSS url() parsing so it is self-hosted.
- Restored source YouTube players using local thumbnails and the existing click-to-load/lightbox mechanism; no passive YouTube requests. Original documents keep their wp-content/uploads paths, including the application ZIP.
- Corrected two inherited accessible-name mismatches without changing visible copy. Static form-preview progress decoration is hidden from assistive technology.
- Fresh captures contain zero job-board references requiring removal. An older search-engine rendering differed; no changes were based on that stale copy.

## Verification

- npm run lint, npm run typecheck, npm run format:check and npm run build passed.
- npx playwright test: 135 passed, zero failed/skipped/flaky.
- Source parity: 57/57 passed, including all three new pages.
- Internal Employer links: 55 checks, zero failures (HTTP targets and anchors).
- Desktop/mobile comparison captures: all three pages at 1440 and 390px, no document overflow. Additional placeholder containment checks at 768 and 320px passed. Screenshots are ignored under docs/audit/screenshots/phase-08/ and reproducible with scripts/capture-employer-comparisons.mjs.
- New tests cover disabled placeholder fields/no POSTs, source videos and keyboard lightbox/focus behavior, no passive WordPress dependencies, the local portrait mask and legacy anchors.
- New page axe checks pass aside from inherited source color-contrast defects retained under owner decision D-004. This is not a claim of full WCAG conformance.
- Mobile Lighthouse lab: Employers 91, Train and Gain 90, Advocate 94; LCP 2.11–2.15s; CLS 0. Single local runs, not field Core Web Vitals. Detailed reports: phase-08-remaining-performance.json, phase-08-remaining-visual-checks.json, phase-08-remaining-internal-links.json and phase-08-remaining-jobboard-removals.json.

## Review and remaining work

Preview: https://yourcnastory-git-codex-employers-r-583bbc-wallysabrias-projects.vercel.app (Vercel sign-in may be required). PR: https://github.com/wallysabria/yourcnastory/pull/21. Review /employers/, /train-and-gain/ and /advocate/ on this deployment. Not merged or published to main in this task. Later content edits and the final Train and Gain inquiry form remain pending owner direction. Existing source wording/amounts are preserved rather than reconciled editorially. No DNS/WordPress changes or live form submissions were made.

