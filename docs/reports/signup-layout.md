# Responsive signup form layout

Owner requested compact form descriptions/disclaimer and no overlap across every signup placement on 2026-11-10 (D-015). The source form widget container used -200px top/-280px bottom margins, making the form extend outside its section. Those offsets are removed; signup sections now grow with the normal-flow card, including validation feedback. Existing section imagery, copy and submission behavior are preserved.

Labels/legends are reduced from 17px to 14px. Input text is 16px with at least 42px control height. Existing 11px helper/disclaimer text remains readable at that size, with line-height reduced from 28.9px to 1.45 (15.95px); required markers no longer inflate label lines. Fields use consistent spacing. White cards keep internal padding (24px desktop/20px mobile); mobile column padding is 16px. No disclosure, consent text, field, language option, validation, API, audience/tag or tracking changes. No live subscriptions submitted.

All 18 placements (nine EN/nine ES) passed at 320,390,600,767,768,1024,1280,1440,1920 CSS px: 162 views. Checks establish form containment within its signup section, clearance from adjacent sections, fields contained horizontally, no document overflow, compact typography and zero exterior FAQ gaps. Six new regression tests also check validation feedback growth and expanding FAQ answers above the signup at 320/768/1440 in both languages. Lint/build/format and all 80 regression tests pass. Evidence: signup-layout.json, signup-layout-tests.json and signup-layout/ screenshots. Browser checks ran on the local production build; mocked integration settings remain unchanged.

FAQ exterior section margins are reset to zero (D-014), preserving inner card padding. Future English Employer FAQ must reuse the approved card design; recorded in docs/phases/phase-08-owner-decisions.md. Employers content remains pending/gated, /faqs/ stays distinct from Career Seekers FAQ, and no Employer pages are enabled by this work.

PR #14 includes these owner-requested refinements with the FAQ reveal fix/card design. Updated protected preview: https://yourcnastory-oc0m35s15-wallysabrias-projects.vercel.app/frequently-asked-questions/; no merge/publication or phase advancement.


## Publication — owner approved 2026-11-10

PR #14 merged as da8bd873cbd027873c7e5dbeef6b4223609e164c after all CI checks passed. Deployment https://yourcnastory-kioull1o8-wallysabrias-projects.vercel.app is READY and owns https://yourcnastory.vercel.app/. Public checks passed all 18 form placements at 320/768/1440 (54 views), eight EN/ES FAQ card views (88 cards), and four automated tests opening/closing every FAQ answer via click/Enter/Space in both languages on desktop/mobile. EN/ES FAQ pages return 200/noindex without production tracking scripts. Evidence: faq-signup-production.json, signup-layout-production.json, faq-cards-production.json and associated screenshot directories. Earlier unmerged/unpublished review notes are superseded. Employers content remains gated; future FAQ styling requirement is recorded. No custom-domain cutover, real subscriptions, integration activation or phase advancement.
