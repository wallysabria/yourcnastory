# CNAP Awards design refresh — D-022

Owner-approved refresh of /cnap-awards/ on codex/awards-design-refresh.

## Changes

- “Jump to an award” navigation uses the five original labels and anchors, with pale-blue pills and a clear current-section state.
- Desktop navigation sticks below the site header, constrained to the award section. Mobile navigation wraps into two columns and scrolls normally.
- Seven white award cards separate award headings/definitions, requirements and application links. CUSP remains selected across its implementation, credentialing and supervisor cards.
- Keyboard activation focuses the selected award. Original hashes, direct deep links and native browser history are preserved. Instant anchor navigation avoids inherited smooth-focus scrolling conflicts.
- Original copy, amounts, URLs, metadata and source-content records remain unchanged. Other pages retain their existing presentation.

## Verification

Commands: npm run lint; npm run typecheck; npm run format:check; npm run build; npx playwright test; node scripts/capture-awards-refresh.mjs; QA_REPORT_PREFIX=_source/awards-refresh-parity node scripts/verify-content.mjs --committed.

Responsive checks cover 1440, 768, 390 and 320px: five navigation links, seven cards, preserved hashes, keyboard activation, heading clearance, current-section tracking across CUSP cards, desktop sticky position, compact mobile layout and no horizontal document overflow. A rendered-copy/destination test compares all seven cards against the frozen source tree.

Source parity: 54/54 passed. Accessibility capture reports only the inherited cyan/white signup-button contrast failure (2.11:1), retained under owner decision D-004. It is not an accessibility conformance pass. Detailed findings: awards-refresh-checks.json.

Local screenshot evidence (ignored, regenerable): docs/audit/screenshots/awards-refresh/awards-{width}.png and navigation-{width}.png. Desktop and mobile viewport screenshots were visually inspected.

Preview: https://yourcnastory-git-codex-awards-desi-402248-wallysabrias-projects.vercel.app/cnap-awards/ (Vercel sign-in may be required). PR: https://github.com/wallysabria/yourcnastory/pull/20. Publication remains pending owner review.

Local results: lint, typecheck, format check and production build passed. Full regression run passed 121 checks; the remaining new copy-comparison test initially used the wrong source field, was corrected, and all six awards checks then passed. CI will rerun the complete 122-test suite.


## Publication verification

PR #20 merged as 4dcef177c39391213fd7b8486ae81fc5cca7e258. All 122 tests passed in PR CI, alongside lint, formatting, source parity and build checks. Vercel reported successful publication; https://yourcnastory.vercel.app/cnap-awards/ returned 200 with the new navigation and refresh stylesheet. All six awards browser tests passed against that public URL, including 1440/768/390/320px anchor and keyboard checks, deep links, page-only styling, and exact card wording/destinations.
