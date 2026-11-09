# Mega-menu source markers and spacing

Owner requested matching the source dropdown's dash/bullet markers as closely as possible (D-010 approved in design log).

Shared EN/ES desktop menus now mark the same child links as the live source: eight career roles and five Career Seekers resource links; seven inactive Employer resource children are also styled consistently. Overview/program links remain unmarked. Optional `nested` presentation flags are stored with the navigation data. Decorative empty CSS pseudo-elements draw the source SVG rectangle at its 14px rendered scale; no hyphen or punctuation is added to accessible labels or frozen Spanish copy.

Live source measurements: 14px/600 link text with 28.9px row line-height and no row margins; 16px/900/16px column headings; 14px SVG icon (16×16 viewBox, rectangle x2.7/y7.2/w10.6/h1.7); actual child text starts 22.5px from the row edge (icon + inline space + text padding). Panel vertical padding and column spacing reproduce the screenshot's compact approximately 407px Career Seekers dropdown at 1920px. Source navigation was inspected read-only with tracking blocked; no WordPress login/form submission.

Only global menu presentation/data/schema are changed. Existing hover intent, safe hover bridge, keyboard/touch handlers, mobile markup, links, gating and footer remain unchanged. Both global JSON records deep-compare equal to main after removing only the new presentation flags.

Verification: lint/typecheck/format/build; existing full regression; 12 local menu views (EN/ES × two menus × 1920/1440/1280), marker group counts/indentation and screenshots. Final stats and protected preview evidence are attached at handoff. No new dependency or implementation-mirroring test. Existing body accessibility exceptions remain; header axe is exercised by the existing add-on tests.

Screenshots and measurements: menu-markers/ and menu-markers.json. A separate PR/preview is prepared; no merge/publication in this task, and no phase advancement or integration/indexing changes.
