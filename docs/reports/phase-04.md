# Phase 4 — Templates, native form and bilingual search

## Status

Implementation is pushed on phase-04-build. This is a review build, not launch approval. Phase 3 PR #4 was merged under the explicit Phase 4 plan approval; main remains that content/foundation deployment. Phase 4 is not merged and Phase 5 has not started.

The code, functional checks and content parity are ready for review. Visual signoff remains open: all 96 raw screenshot comparisons exceed the threshold. Accessibility has the source styling failures the owner explicitly chose to retain (D-004 declined). Do not describe this build as pixel-identical or WCAG AA conformant.

## Implemented

48 static EN/ES pages across nine template types, using the frozen Phase 3 content and self-hosted source CSS, media, fonts and decorative vectors. All homepage employer blocks render; employer destinations remain inert. Employers pages remain gated.

Native keyboard-accessible accordions, scroll-snap carousels, source-styled video dialogs and inline players, reduced-motion handling, approved pause controls, privacy contents navigation and keyboard flip boxes replace legacy widget scripts. Search opens in a native modal, restores focus, handles clear/empty/error states and returns current-language results only. Existing global menus, language pairing, footer and back-to-top remain integrated.

Mailchimp is mock only because the audience setup is missing. One reusable form retains source labels/IDs and exact EN/ES SMS disclosure, with English/Español options, country code, shared client/server validation, accessible errors, pending/error/rate-limit states, honeypot, double-submit guard and an event hook without analytics. No real subscription is created. See docs/integrations/mailchimp.md.

## Preview by template

Vercel sign-in is required. The branch preview is https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/; immutable verified deployment details are recorded in phase-04-cloud-checks.json when cloud verification completes.

| Template | URLs | English example | Spanish example |
|---|---:|---|---|
| careerpath-entry | 16 | [/careerpaths/careers-in-certified-nurse-assistant/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/careerpaths/careers-in-certified-nurse-assistant/) | [/es/carreras/carreras-en-asistente-de-enfermeria-certificado/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/es/carreras/carreras-en-asistente-de-enfermeria-certificado/) |
| homepage | 2 | [/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/) | [/es/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/es/) |
| career-section-landing | 2 | [/career-seekers/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/career-seekers/) | [/es/aspirantes/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/es/aspirantes/) |
| careerpath-index | 2 | [/career-paths-in-long-term-care/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/career-paths-in-long-term-care/) | [/es/caminos-profesionales-en-el-cuidado-a-largo-plazo/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/es/caminos-profesionales-en-el-cuidado-a-largo-plazo/) |
| anchored-resources | 2 | [/community-resources/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/community-resources/) | [/es/recursos-comunitarios/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/es/recursos-comunitarios/) |
| policy | 2 | [/privacy-policy/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/privacy-policy/) | [/es/politica-de-privacidad/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/es/politica-de-privacidad/) |
| standard-content-or-legacy | 8 | [/certified-nurse-assistant-program/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/certified-nurse-assistant-program/) | [/es/que-es-cuidar-a-largo-plazo/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/es/que-es-cuidar-a-largo-plazo/) |
| campaign-signup | 12 | [/earn-and-learn-la/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/earn-and-learn-la/) | [/es/ganar-y-aprender-la/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/es/ganar-y-aprender-la/) |
| faq-accordion | 2 | [/frequently-asked-questions/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/frequently-asked-questions/) | [/es/preguntas-frecuentes/](https://yourcnastory-git-phase-04-build-wallysabrias-projects.vercel.app/es/preguntas-frecuentes/) |

The complete 48-route inventory remains content/routing/slug-map.json and content/pages/index.json.

## Verification

- npm run lint, npm run typecheck, npm run format:check and npm run build passed locally.
- npx playwright test --workers=4: 37 passed. See phase-04-tests.json. Includes 250 redirect checks, all 48 languages/canonicals/noindex, all 344 original media byte lengths, native form mock/failure/existing-subscriber contracts, keyboard menus/search/FAQ/video, privacy anchors, carousel pause and bilingual/FAQ-answer search.
- npm run content:verify: 48/48 frozen source records passed. node scripts/check-rendered-parity.mjs: 48/48 normalized rendered character streams and all retained source anchors passed. Approved interface changes are narrowly handled: retired VI/ZH radios, canonical language labels and native controls; original content JSON remains unchanged.
- node scripts/check-accessibility.mjs: 96 page/viewport checks, no horizontal overflow. 56 zero-violation views; 40 views retain only color-contrast and/or link-in-text-block failures. D-004 was declined by the owner on 2026-11-08. All other observed ARIA/list/heading/control issues were corrected. Full targets/details remain phase-04-accessibility.json. Passing regression checks allow only the documented source exceptions; they do not mean zero axe failures.
- npm audit --omit=dev: zero vulnerabilities. No analytics/chat/consent/structured-data additions.

## Search build

Pagefind indexes 48 canonical content records, two languages and 3033 unique words. Only the approved route whitelist enters the index; forms, retired pages, Employers pages and the diagnostic endpoint are excluded. Collapsed FAQ answers are included. PDFs remain excluded: Phase 2 proved extraction/custom records require a separate build step; no native straightforward PDF index was available.

The first Vercel preview failed because the adapter collected/moved Next HTML before the post-build search step. Commit 4143e71 builds search directly from canonical content before Next/Vercel collects public assets. The corrected Vercel preview reached READY. Cloud functional verification is separately recorded; build success alone is not a search-runtime claim.

## Visual evidence and limits

node scripts/check-visual-parity.mjs captured every approved URL at 1440×1000 and 390×844. Pixelmatch tolerance is 0.1; more than 0.5% changed pixels flags a view. All 96 views are flagged, with raw ratios/heights in phase-04-visual.json. No masking was used to manufacture a pass. Source, native and difference images are local/ignored, accessible through phase-04-visual-review.html.

Supplemental current-source captures (phase-04-stabilized-visual.json) scroll-load pages, wait for fonts, stop/reset carousels and pause video; the retired chatbot is hidden and external video frames blocked in that supplemental run only. They still expose source widgets remaining uninitialized/blank. That supplemental set predates the final privacy contents completion and is supporting diagnosis, not final screenshot certification.

Known drivers include source lazy/blank image and carousel regions, video frames/animation state, missing runtime-generated grids/contents, the retired chat launcher, disabled employer controls, logged job-board removals and approved form overflow/two-language/motion controls. Native pages render the preserved content instead of retaining loading spinners. These categories explain substantial capture differences, but not every flagged pixel has been individually accepted or attributed. Visual review/signoff is still required; no blanket visual pass is claimed.

## Open gates and handoff

1. Review the 96 flagged visual comparisons and the native preview before merging. Unexplained visual differences remain a Phase 4 acceptance item.
2. Mailchimp audience ID, verified API/merge/tag/group/SMS mappings, server credentials and an owner-approved test audience/tag are missing. Stop before live connection. In-memory rate limiting must be revisited for live integration.
3. Retained contrast and inline-link failures remain explicit accessibility debt under the owner's source-style decision. Phase 5 must respect that decision; it must not silently apply D-004.
4. Missing full database/uploads/brand inputs and legacy-route classification decisions remain inherited limits; no historical-upload completeness or launch-readiness claim. The inert content-review endpoint must be removed before launch when no longer needed.
5. Phase 5 requires explicit approval and its own plan. Existing GA4/Clarity ownership/IDs and reviewed consent/privacy requirements will be needed then. No Employers work, DNS changes, production promotion or Phase 5 implementation occurred.

All four standing logs are updated. Additional new Spanish interface strings are enumerated in spanish-review-log.md; Spanish page bodies and source punctuation are unchanged.
