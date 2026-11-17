# CUSP implementation video restoration — D-021

Owner explicitly requested restoring the video in Successful CUSP Implementation, matching the existing site's click-to-load/lightbox behavior. Branch: codex/cusp-implementation-video. Review-only until publication is requested.

## Source and cause

Current public source https://yourcnastory.org/cusp-upskilling/ declares widget 731d597 with youtube_url=https://www.youtube.com/watch?v=aTyd4jfB0OY, video_type=youtube and controls=yes. These settings were retained in the layout, but the renderer parsed the URL pathname as the ID (watch), found no poster and returned null. The original video was therefore omitted. The restoration parses supported YouTube URL forms and restores this exact ID.

## Changes

- Self-hosted original max-resolution YouTube thumbnail: public/images/content/cusp-successful-implementation-youtube.jpg (75,640 bytes), provenance/hash in content/integrations/external-video-posters.json.
- Reuse the existing VideoTrigger/native dialog, with the same dark backdrop, responsive 16:9 player, Escape/button/backdrop closure, focus restoration and iframe removal to stop playback.
- No YouTube iframe/request before explicit activation. Exact original video loads at https://www.youtube.com/embed/aTyd4jfB0OY?rel=0. No autoplay parameter added.
- Desktop two-column video/text block; mobile stack. CUSP refresh, all original copy, page-content records, metadata, URLs and anchors preserved. Existing Community Resources inline players retain their mode; no global conversion to lightboxes.

## Verification

116 Playwright tests passed; lint, typecheck, formatting and production build passed. Source parity 54/54 against committed baselines. New parser tests cover watch, short and embed URLs plus rejected inputs; new browser tests cover 1440x1000, 390x844 and 844x390, no passive provider requests, keyboard activation, correct video ID, modal viewport bounds, Escape and close-button cleanup/focus.

Local screenshots at docs/audit/screenshots/cusp-video/: desktop/mobile block and dialog. Both block screenshots visually reviewed. Dialog screenshots/tests block provider requests, so they prove local modal behavior and destination, not a completed YouTube playback session. Source thumbnail inspected and matches the owner's screenshot. No live form, analytics, chatbot or database actions. Existing accessibility/performance flags remain as previously documented.

PR/preview pending push; normal Vercel sign-in may be required. No protection bypass created.
