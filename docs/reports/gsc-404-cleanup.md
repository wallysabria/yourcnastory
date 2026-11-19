# Search Console legacy cleanup

Owner approved all four decisions on 2026-11-19. Branch: codex/legacy-url-cleanup.

## Implemented

- Four explicit direct 301s cover /careerpaths/ and /es/preguntas-frecuente/, plus slashless versions, to their approved existing destinations. 284 static redirect rules total.
- Six privacy alias bases (both slash forms) redirect directly to /privacy-policy/#privacy-choices or /es/politica-de-privacidad/#privacy-choices. Vietnamese/Chinese aliases use English. Queries are preserved before the fragment, including obsolete clang parameters; those parameters do not override the selected language.
- Policy-page deep links open the existing privacy dialog automatically. The stable footer button is the focus return target. Ordinary policy visits do not auto-open; unrelated pages do not open for this fragment.
- Exact retired job-board and literal-star URL exceptions bypass the generic retired-language/homepage fallback and remain genuine 404s. Existing hosting security responses for obsolete plugin/wp-content paths are preserved. No broad upload wildcard redirect or original document deletion.
- Page copy, privacy policy wording, metadata, translations and source assets are unchanged. No consent is granted by opening settings, and GPC still overrides saved choices. Production tracking remains gated/off on staging.

## Evidence

- npm run lint, npm run typecheck, npm run format:check and production build passed.
- Full Playwright suite: 146 passed.
- Exact screenshot URLs: 27/27 passed — scripts/check-gsc-legacy-cleanup.mjs; full chains in gsc-404-cleanup-verification.json. Checks cover direct replacements and final unavailable statuses without homepage fallbacks.
- Source parity: 57/57 passed.
- New browser checks cover EN/ES at 1440/390px, real automatic dialog opening, unchanged default denial, saved choices, GPC, no live tracking requests, Escape/Close/reopen/focus and zero axe findings within the dialog. Request tests cover every privacy base in both slash forms with preserved queries and valid policy targets.
- Existing application ZIP still returns 200. Policy body/canonical metadata remain source-matched under the full suite.

## Review and remaining work

Preview: https://yourcnastory-git-codex-legacy-url-cleanup-wallysabrias-projects.vercel.app/privacy-policy/#privacy-choices (Vercel sign-in may be required). PR: https://github.com/wallysabria/yourcnastory/pull/23. No WordPress, DNS, Search Console or live integration changes. Review-site publication requires owner merge instruction; Search Console on yourcnastory.org can only observe these changes after cutover (or separately authorized source-site work). The original 27-list cleanup is ready for review; broader historical pages are not silently resolved. Grouped proposal: docs/recommendations/remaining-legacy-url-dispositions.md.

## Publication verification

Owner approved merge/publication. PR #23 merged as 9d31f6afa4baa6cf5d11a8652213e9d0b06ddd31. The public Vercel alias served the new rules; the complete 27-URL live audit passed, with results recorded in gsc-404-cleanup-verification.json. Six of eight additional live browser/request checks passed, including EN/ES dialogs at desktop/mobile widths, Escape/focus/reopen, ordinary-vs-deep-link behavior, retired URLs and the real upload. Two follow-up checks (exhaustive privacy query variants and saved-consent/GPC) were blocked by Vercel Security Checkpoint, including a sequential retry after a pause; these remain incomplete on the live host. Both passed locally and in the full 146-test PR CI suite. No security setting was changed or bypass created. WordPress/custom-domain routing remains unchanged until cutover.
