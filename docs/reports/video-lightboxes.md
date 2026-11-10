# Source-style video lightboxes

Owner requested that video buttons show an in-page popup/shadowbox matching the reference (D-016, approved 2026-11-10). Public Career Seekers reproduction found the button already opens the shared native dialog with the source YouTube embed URL, but the player appeared at x0/y0 and its close control could sit above the viewport. The source actions are 22 button instances across 20 EN/ES pages, including separately hidden desktop/mobile variants.

The shared player is explicitly centered over a dark backdrop and scales at 16:9 within both viewport width and height (maximum 1600px width), including short landscape screens. A 44px close control stays visible at the viewport top-right with keyboard focus styling. Native modal background inertness is retained. Trigger ARIA links to a unique dialog ID; closing via Escape, close button, backdrop or native close event centralizes iframe teardown and trigger focus restoration. Body scrolling unlocks on close. Video IDs/URLs, source button appearance, visible copy, metadata and destinations are unchanged; no page navigation/new tab is introduced. No new library or YouTube API is needed.

Third-party frames are still absent until user activation. Previously approved Community Resources inline YouTube/Vidyard click-to-load players remain inline (D-006). Employers content remains gated. No tracking/integration/indexing activation or phase advancement.

Verification: npm run lint; npm run build; npm run format:check; full regression 86/86 passes. Six new EN/ES cases cover centered viewport fit and visible close controls at 1440×1000,390×844,844×390; background controls cannot take focus while modal, and Escape/button/backdrop close removes the iframe, restores trigger focus and body scrolling, without leaving the page. Source-button audit checks all 22 instances at 1920×1000,390×844,844×390: 60 visible activations pass with original URLs preserved; six source-hidden responsive variants recorded. Phone tests use real touch emulation. No provider request occurs before activation.

Evidence: video-lightboxes.json, video-lightboxes-tests.json and six EN/ES screenshots in video-lightboxes/. YouTube iframe responses are mocked for tests/screenshots; the labeled test player is an evidence fixture, not production UI. These checks verify interaction/layout/teardown, not live YouTube playback availability. Browser evidence is from the local production build. No live forms submitted.

PR/preview pending. No merge/publication; normal preview protection retained.
