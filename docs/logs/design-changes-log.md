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
