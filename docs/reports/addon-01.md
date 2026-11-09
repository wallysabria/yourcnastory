# Add-on 01 — favicon and mega-menu behavior

Status: implemented on addon-01-favicon-menu-og for separate review. Owner approved the reduced plan; social preview images/samples and their approved-design entry are deferred. No phase advancement, merge or production promotion.

## Delivered

D-007/D-008 are approved in design-changes-log.md. App Router icon files/manifest carry over the original live favicon. The desktop menu now has centralized 100ms open/350ms close timing, cancelable timers, immediate switching while a panel is active, and an invisible measured trapezoid bridging the trigger/panel gap. Pointer entry cancels closing, keyboard Enter/Space opens, ArrowDown enters links, Escape closes/returns focus and leaving the group by Tab closes it. Touch first tap opens; tapping outside closes; a second tap retains an enabled top-level destination. Employer destinations remain inactive. Mobile markup/styles are unchanged; no motion animation was added and existing reduced-motion rules remain.

## Icons / source

_source/brand/ was absent. Approved fallback: https://yourcnastory.org/wp-content/uploads/2025/09/cropped-favicon-270x270.png (270×270). Original is served unchanged at that exact upload path, with SHA-256 recorded in content/brand/icons.json. A larger or SVG source would give sharper large icons; the 512px output is upscaled. No vector source was available and no SVG was invented.

| File | Size / purpose |
|---|---|
| app/favicon.ico | Embedded 16/32/48px PNG frames |
| app/icon.png | 32×32 browser icon |
| app/apple-icon.png | 180×180 Apple touch icon |
| public/images/icons/app-icon-192.png | 192×192 manifest icon |
| public/images/icons/app-icon-512.png | 512×512 manifest icon |
| app/manifest.ts | App Router web manifest, display=browser, theme_color=#0159d3 from --blue design token |
| public/wp-content/uploads/2025/09/cropped-favicon-270x270.png | Unmodified 270×270 source retained |

Generation: node scripts/generate-app-icons.mjs. Existing Next-provided Sharp is used; no new package. ICO directory/frame sizes and served PNG/manifest dimensions are independently checked by tests.

## Verification

- lint, typecheck, format:check and production build passed.
- Full Playwright regression: 70 passed, including eight add-on cases, existing mobile navigation, source metadata/copy and all 280 redirects.
- Focused Firefox: six passed/two touch-emulation skips; WebKit: eight passed. Header axe checks return zero violations in both language panels across the three engines.
- Hover tests cover delayed opening, lingering in the bridge past close delay, diagonal entry, immediate switching, brief exit/re-entry and final delayed close. Keyboard tests cover visible focus, expanded/controls, Enter/Space, explicit ArrowDown, Escape return and Tab exit. Touch tests cover first tap/outside tap/second-tap destination with reduced motion.
- Four panel-only published-before/local-after comparisons (two menus × EN/ES) have identical dimensions and zero changed pixels. Evidence: addon-01-menu-appearance.json. This is scoped appearance parity, not whole-site certification.
- Original favicon source SHA-256 preserved; App Router head tags and fetched icon dimensions pass in EN/ES. Final rendered preview tags/screenshots and deployment SHA will be attached after hosted verification.

Background media is isolated in header tests. WebKit DOM-ready/targeted-font readiness avoids waiting for streaming media. Its native Tab behavior follows platform preferences; ArrowDown provides explicit panel entry. Automated WebKit/touch emulation is not native Safari/iOS or physical-device certification. Existing whole-site D-004 accessibility/performance exceptions remain unchanged.

## Social preview images

Deferred at the owner's request. No option A/B/C implementation, six sample renders, OG coverage gate or og:image/twitter:image change is included. Existing titles, descriptions and social metadata remain source-driven.

## Preview / handoff

Protected preview and separate PR are being prepared; do not merge or publish automatically. Employers remains English-only, content pending and gated. Chatbots remain deferred. Indexing and live integrations stay disabled/mocked.
