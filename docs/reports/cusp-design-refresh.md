# CUSP design refresh — D-020

Owner approved the focused /cusp-upskilling/ refresh on 2026-11-16. Branch: codex/cusp-design-refresh. Review only; merge/publication not requested yet.

## Changes

- FAQ-style pale section backgrounds, white rounded overview panel, vertical desktop navigation and mobile accordion controls.
- Seven independently expandable native level cards with source titles/panel IDs and plus/minus circles. Existing content remains in server-rendered markup.
- Five benefit cards arranged in a responsive 3/2/1-column grid, using original icons and verbatim copy; source decorative empty columns removed from rendered layout.
- Enlarged original timeline inside a white bordered card, with consistent section spacing.
- Original hero, content JSON, media, destinations, metadata and URL unchanged. No content or database work on held pages. Stylesheet/class are applied only to this route.

## Verification

Four-width capture/audit at 1440/768/390/320: no document overflow, seven level cards and zero axe violations in the initial state. See cusp-refresh-checks.json. Screenshots are local/ignored at docs/audit/screenshots/cusp-refresh/; desktop/mobile inspected, including the corrected five-card grid.

Expanded-card checks verify all seven bodies are visible and readable, all original anchor IDs remain present, benefit cards have usable widths, and desktop vertical keyboard navigation works. All four fully expanded states flag only the inherited link-in-text-block rule on four original external links; source link treatment retained under the owner's earlier D-004 decision, full audit attached to tests. Do not claim zero expanded-state axe violations or full WCAG conformance. Existing site-wide mobile lab-performance flags remain open; no new field CWV claim.

Final lint, types, formatting, build and full test results recorded after completion below. Source-copy parity is unchanged because no source page file is modified; original 54-page committed/captured verification is rerun for handoff. External links retain new-tab security attributes. No live forms, API calls, tracking activation, protection bypass or custom-domain changes.

PR: https://github.com/wallysabria/yourcnastory/pull/18

Protected review preview: https://yourcnastory-git-codex-cusp-design-1fac94-wallysabrias-projects.vercel.app/cusp-upskilling/ Review preview may require normal Vercel sign-in; no protection bypass will be created.

## Final local checks

111 Playwright tests passed, including four-width expanded-card/anchor/readability coverage and overview keyboard navigation. Lint, typecheck, formatting and production build passed. Committed-source parity: 54/54, with original text hashes asserted. No source content/media/metadata files changed.

When every card is expanded, four pre-existing inline links trigger link-in-text-block (color-only identification). D-004 retained source link treatment; the new tests attach these findings and reject all other axe violations. Initial-state audits at all four widths found zero violations. This is not a claim of zero violations in every interactive state.

Follow-up responsive-state check: closing all overview panels on mobile and resizing to desktop preserves a keyboard tab stop. Six focused CUSP tests passed after this correction; lint and build passed again. No new visual/copy change.

Review PR: https://github.com/wallysabria/yourcnastory/pull/18

Protected branch preview: https://yourcnastory-git-codex-cusp-design-1fac94-wallysabrias-projects.vercel.app/cusp-upskilling/ (normal Vercel sign-in). The page-only stylesheet is inlined during static generation to avoid an extra render-blocking request. Latest mobile lab sample remains LCP ~4.59s, CLS 0 and TBT ~74ms; performance acceptance remains open, not a claim of field CWV. The old phase-08 report is preserved. An added keyboard test confirms the overview is reachable after closing all mobile panels and resizing to desktop.

## Publication — owner authorized 2026-11-16

PR #18 merged as 436287890246749fa2deefd2c4ac6ad7b031d205 after green CI (112 tests). Vercel deployment 63QDYo4iaFsuCdB2TZJ5GSwwyu6Z completed successfully. The refresh is public at https://yourcnastory.vercel.app/cusp-upskilling/ without sign-in or bypass. Six published-site tests passed across 1440/768/390/320, covering every level card, original anchors, benefit widths, keyboard controls and mobile-to-desktop state. Employers, Train and Gain, Advocate remain HTTP 404. Existing link-style and lab performance flags remain documented; indexing stays blocked. No chatbot/database, live tracking, live form submissions or custom-domain cutover.

Earlier preview-only/unmerged statements describe the review handoff and are superseded by this owner-authorized publication.
