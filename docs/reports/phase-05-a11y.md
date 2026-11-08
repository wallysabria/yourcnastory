# Phase 5 accessibility verification

Checked 2026-11-08. This is an implementation audit, not WCAG certification. The owner explicitly declined D-004 styling changes; zero-axe acceptance remains unmet for inherited contrast/link failures.

## Coverage and results

| Check | Result |
|---|---|
| Axe WCAG 2 A/AA and 2.1 AA, 48 URLs × desktop/mobile × no choice/declined | 192 states; 112 zero violations, 80 states retain only color-contrast/link-in-text-block |
| New privacy banner and preferences, desktop/mobile | Zero axe violations in isolated UI checks |
| Horizontal overflow, desktop/mobile full scan | None |
| Keyboard and accessible-name checks, nine templates × EN/ES | 18 representative pages passed |
| Equivalent 200%/400% reflow | 640/320 CSS-pixel viewports from a 1280-pixel baseline; headings visible, no horizontal document overflow on all 18 |
| Reduced motion | All 18 preserve visible content grids; no playing background videos |
| Signup errors, FAQ, menus, search, video dialog | Playwright interaction coverage, EN/ES search/form scenarios; mock submissions only |
| Source copy/anchor preservation | All 48 rendered pages match; no missing anchors |

Raw evidence: phase-05-accessibility.json, phase-05-manual-checks.json and the Phase 5 regression suite. The audit blocks external player requests to isolate first-party DOM checks; independent D-006 tests establish no passive provider requests before Play. It does not audit the internals of a third-party player after playback is requested.

## Native changes and approvals

- The existing skip target now has tabindex=-1 so activating Skip to content both scrolls and moves focus. The representative checks confirm the content target receives focus.
- D-005 consent UI: equal action prominence, native modal focus containment/Escape, focus restoration, labels and status feedback, separate optional categories, footer reopening, storage failure messaging and signal overrides. The fixed banner reserves bottom space and scrolls internally on small screens.
- D-006 separately approved: self-hosted original video posters and accessible Play buttons. Keyboard activation creates and focuses the titled provider iframe. No analytics grant is required to request a video.
- Prior D-001 zoomable viewport, D-002 form overflow and D-003 motion controls remain.
- D-004 remains declined. Existing cyan CTA text contrast and links distinguished only by color were preserved and flagged. No AA conformance/zero-violation claim.

## Manual checklist method and limits

Chromium keyboard actions verify first-tab skip control, skip destination focus, search input focus, Escape restoration and footer privacy-dialog restoration on every representative page. Dedicated regression cases additionally cover mobile/mega navigation, FAQ, contents, carousel controls and video dialog focus. Field-name checks exclude hidden honeypots and submit controls (whose names come from their value). Signup validation/error summaries are exercised against the mock endpoint; no live audience or lead form is submitted.

The reflow check uses 1280/640/320 CSS-pixel viewports, corresponding to available layout width at 100/200/400% browser zoom. It is **not** an actual browser-menu zoom or OS magnifier test. Root CSS zoom was tested during investigation and rejected as a substitute for responsive reflow; the final evidence uses viewport width. Native screen-reader speech output (NVDA/JAWS/VoiceOver), cross-browser assistive technology and actual browser-menu zoom remain unverified. Accessible names/roles and keyboard behavior are not a substitute for those tests.

Content/alt-quality review is logged in docs/audit/issues.md. Existing Spanish source wording and decorative/descriptive image decisions were not silently rewritten. Source empty alt values are an editorial review item, not proof that a missing description is appropriate. Existing Phase 4 visual flags remain review items; this phase does not certify pixel parity of the entire migrated site.
