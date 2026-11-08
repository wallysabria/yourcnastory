# Design changes log

Default is to match the live site. Any deliberate visual or layout change is logged here as
**proposed** and ships only once marked **approved** (`CLAUDE.md` §4.6).

Status values: `proposed` / `approved` / `rejected`.

| ID | Page | Change | Benefit | Status |
|----|------|--------|---------|--------|
| D-001 | All pages | Remove the viewport setting that blocks pinch-zoom | Accessibility (WCAG 1.4.4 Resize text) | approved |
| D-002 | All pages with the Mailchimp form | Fix the Mailchimp form overflowing its section | Layout / clarity on mobile | approved |

## Phase 1 — P1-AUDIT-NO-DESIGN-CHANGES

No design/layout changes proposed or implemented. Reference screenshots and existing-site issues recorded only. D-001/D-002 remain the only pre-approved fixes.

## Phase 2
D-001 implemented through the default zoomable viewport. D-002 deferred until the native form is built. Global layout follows source measurements; no additional deliberate design change approved or introduced. Employers destinations disabled as required. Screenshot evidence is a review reference, not final parity certification.

## Phase 3
No production template or design change. /api/content-review/ is an explicitly labeled, inert diagnostic rendering for content verification only; it does not replace any page layout. All public route bodies remain Phase 2 shells pending Phase 4. D-002 remains deferred until form implementation.

## Phase 4 approvals
D-003 — approved by owner with Phase 4 plan (2026-11-07): add pause/play controls for autoplay media where missing, styled to match existing controls, to support accessible motion control. D-001 pinch zoom and D-002 signup overflow remain approved. No other deliberate visual deviation is authorized.

## D-004 — Accessible source contrast and inline links — declined (2026-11-08)

Full Phase 4 axe checks identified white text on cyan (#0BC4D9) at 2.11:1 (needs 4.5:1), plus inline links distinguished only by color. Proposal: retain cyan backgrounds and use existing dark brand text #2C3338 (about 6.0:1) only on the affected cyan CTAs; underline inline heading links and the SMS terms link. No copy, sizing, layout, or destination changes. Applies to EN/ES Career Seekers, Career Advancement, CNA Program and Earn and Learn variants where present. Preview images: ignored _source/phase-04/contrast-before.png and contrast-proposed.png. Requires explicit approval under CLAUDE.md §4.6; not applied to shipping styles.

Owner decision: keep source styling and flag accessibility failures. No D-004 styling applied. Zero-axe acceptance remains unmet for these inherited issues; no WCAG AA conformance claim.

## D-005 — Phase 5 consent interface — proposed (2026-11-08)

Native consent banner/preferences with equally prominent Accept/Decline controls, necessary/analytics categories, visible keyboard focus and a persistent footer Privacy choices link. Benefit: clear optional analytics control, browser privacy-signal handling and accessible preference management. Use existing blue/dark typography on a white panel, same-size/same-fill action buttons. Exact proposed EN/ES wording and counsel review status are in docs/recommendations/phase-05-consent-copy.md. Not implemented or published; pending plan/copy approval. Existing source body copy and D-004 decision are unchanged.

D-005 revision (2026-11-08), still proposed: retain advertising as directed; preferences now separate necessary, analytics and advertising. Equal-weight Accept all optional tools / Decline all optional tools, with granular settings. Revised copy is in docs/recommendations/phase-05-consent-copy.md. No UI published.

## D-005 approval — 2026-11-08

Owner explicitly approved the revised Phase 5/tag plan in chat, including the three-category bilingual consent interface. D-005 is approved and implemented on the Phase 5 branch. Existing policy body and D-004 source styling remain unchanged. Counsel review is required before release.

## D-006 — approved 2026-11-08

Owner explicitly approved click-to-load inline YouTube/Vidyard players on both Community Resources pages. Preserve original self-hosted thumbnails, 16:9 placement and existing localized Play labels. Provider iframe is created only after activation; keyboard focus moves to it. No analytics grant is required to watch requested media. Prototype and proposal: docs/recommendations/phase-05-external-media.md. External providers may collect data after playback is requested; no no-tracking-after-Play claim.

Phase 5 final checks preserve D-004 and approved D-005/D-006. Mobile contents now starts collapsed before hydration, matching its existing final mobile state and removing CLS; this is a native rendering correction, not a new design. Eight original/compressed-font screenshot checks show zero changed pixels. Whole-site pixel parity is not claimed.

## Phase 7 planning — 2026-11-08

No design change implemented or approved. Planned semantic heading corrections must preserve source styling; any new visible breadcrumb/interface design requires a separate concrete proposal. Proposed source-style search query support reuses the existing search interface and awaits Phase 7 plan approval.

## Phase 7 semantic and search verification — 2026-11-08

No deliberate visual redesign. Actual HTML heading tags now match the existing logical/ARIA hierarchy. Derived CSS preserves original type specificity and source styles; 96 controlled desktop/mobile views have identical heading geometry/typography and zero changed screenshot pixels. Original source CSS retained. Source-style ?s= links open the existing search dialog; Escape now closes a populated search field dialog and restores focus. No new UI styling or breadcrumb row. D-004 remains declined; the full 192-state axe scan retains only its contrast/link failures.
