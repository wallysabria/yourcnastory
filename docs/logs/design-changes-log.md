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


Phase 7 final owner decision — 2026-11-08: the three retired-language direct redirects in phase-07-retired-counterparts.json are approved and implemented (including slash and percent-encoding case variants). Destinations use declared English counterparts. No page copy or styling changes. Phase 6 and Employers remain deferred.


## Preliminary Phase 10 QA — 2026-11-08

Detailed limited QA plan approved in chat. Career Seekers/shared EN/ES only; Employers remains English-only and on hold, and Phase 6 remains deferred. A renderer defect converted fragment-only career links into homepage links. Restoring the original fragment semantics is an implementation defect fix with no copy/design/route change. EN/ES nursing jump regression tests pass. Ten source-evidenced legacy redirects are proposed separately, inactive pending owner approval. Source-missing cnap-flyer and cusp anchors and one broken Spanish legacy link remain reported; no invented replacements. D-004 remains declined. No new Spanish UI text or visual design change.


Preliminary QA cross-browser fix: explicitly focus the clicked Privacy choices/Manage preferences opener before dispatching the existing open event. WebKit pointer activation otherwise does not focus buttons, so returning focus could target the page body. No consent wording, categories, storage or styling changed. Final representative matrix: 108 Edge/Firefox/WebKit checks passed; Chromium suite: 62 passed. Native Safari/iOS and physical devices remain unverified.


Owner approved all ten source-evidenced legacy redirects on 2026-11-08. Implemented 20 direct 301 rules including slash variants, preserving queries and existing destination paths. Total active rules: 280. Earlier pending status is superseded. The source-broken Spanish start-career link and three source-missing anchor destinations remain unresolved.


Preliminary QA handoff: 62 final regression tests pass, including 280 HTTP redirects; 48 content/source matches; 108 extended browser representative checks; 192-state baseline axe retains only D-004. All 54 mobile lab runs completed: 6/18 LCP, 11/18 score≥90, 18/18 CLS and TBT. Protected preview checks passed 48 pages/552 assets and both fixes, with temporary credentials revoked. One source-broken Spanish path, three source-missing anchor targets, source visual differences, performance/security and remaining integration/native-device/counsel gates remain explicit. No merge/publication or full-site launch sign-off.

## Add-on 01 — approved 2026-11-08

- D-007 **approved**: favicon and app icons carried over from the live site, using App Router metadata conventions and the existing brand theme token.
- D-008 **approved**: mega menu stays open reliably on hover, with hover intent, a continuous hover bridge, keyboard/focus and touch handling. Appearance and mobile navigation remain unchanged; Employer destinations stay gated.
- Social preview images, sample renders and their design-log entry are deferred by the owner's subsequent instruction. No og:image/twitter:image exception is implemented in this add-on. Titles, descriptions and current social image metadata remain unchanged.

The owner explicitly approved the reduced plan in chat. This add-on uses its own branch/PR and does not advance the phase roadmap.

## D-009 — Career-path card formatting — approved

Owner requested circular picture windows and formatting matching the “Where will your new career take you?” Career Seekers carousel. Apply the carousel's 200px circular portraits, centered 20px/600/26px titles, 17px/400/28.9px descriptions and 15px image / 10px description spacing to the EN/ES careerpath-index grid. Preserve original copy, images, destinations, responsive grid and other pages. Screenshot red circles are annotations, not red borders. This is a scoped owner-approved visual correction, not a new phase.

## D-010 — Mega-menu dash markers and source spacing — approved

Owner requested matching the reference dropdown's dash/bullet markers as closely as possible. Mark the eight career-role children, five Career Seekers resource children and seven inactive Employer resource children in each language as visual subitems; leave each leading overview link and the program links unmarked. Use decorative CSS dashes and 22.5px indentation (14px source icon, 3.5px inline space and 5px text padding), source 14px/600/28.9px link typography, zero row margins, 16px/900 headings with 10px following space, and 60px vertical panel padding. Dash dimensions reproduce the source SVG rectangle at its 14px rendered size. No punctuation is inserted into frozen labels. Existing hover intent, keyboard/touch behavior, mobile navigation, destinations and Employer gating remain unchanged.


## Career SVG styling artifact — approved 2026-11-10

Owner approved removing only the leaked `.cls-63ce7424ea57ea6c8380058e-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}` fragment (both currentColor and grey stroke variants) from eight EN and eight ES career-detail pages. No editorial correction, URL/link destination, metadata, image or layout change. Exact scoped policy: content/migration/svg-text-cleanup.json. Update extraction/parity normalization and hashes together to prevent reintroduction. No other Spanish changes authorized.


## D-011 — Career-detail carousel arrows — approved 2026-11-10

Owner requested matching the source left/right carousel arrows. Scoped to EN/ES careerpath-entry pages: reuse the already self-hosted Font Awesome 5 Free 900 chevrons f053/f054 at 24px, brand blue #0159d3, original 40px control boxes and responsive positions; restore source translateY(-50%) for previous and translate(-100%, -50%) for next. Source desktop previous offset -62px/mobile 0 and next left 100% remain in existing route CSS. Keep button labels, keyboard/touch/scroll behavior, focus indication, all copy/destinations and other carousels unchanged. Screenshot red boxes are annotations. No new font, dependency or source-site change.

Keyboard-only focus outline restored on these buttons because inherited theme rules suppressed it. Scoped icon pseudo-elements explicitly reset the theme hover-background positioning/opacity so both chevrons remain visible.
