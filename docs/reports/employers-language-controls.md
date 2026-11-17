# English-only Employer language controls — D-024

Owner requested removing alternate-language options from every Employer page. The shared route layout passes an explicit section-based flag to the header; Employer routes emit neither the desktop language menu nor the mobile language branch. Future Employer pages follow the same rule. Career Seekers and shared-page language controls remain unchanged.

No page copy, translations, metadata, URLs or integrations changed. Source styling retained. The change removes the prior disabled Español option rather than hiding it with CSS.

Verification: npm run lint and npm run build passed; formatting check passed. Browser coverage iterates all nine approved Employer pages at 1440 and 390px and checks that no desktop/mobile language controls are rendered; it also verifies the Career Seekers Spanish destination remains available. Existing header navigation, mobile, accessibility and Employer regressions are included in the focused run.

Preview: https://yourcnastory-git-codex-employers-h-0a1386-wallysabrias-projects.vercel.app/employers/. PR: https://github.com/wallysabria/yourcnastory/pull/22. Vercel sign-in may be required. Not merged or published.

Focused browser run: 56 passed (all nine Employer pages plus shared/Career Seekers header and navigation regressions).

## Spanish navigation follow-up — D-025

Owner requested retaining “Empleadores” as the Spanish top-level label, with /employers/ as its destination and English Employer mega-menu content. The rendered navigation reuses the English desktop Employer columns without modifying the frozen Spanish source JSON. English fragments are tagged lang=en. The mobile Employer branch uses the same complete labels/destinations on both languages, fixing its old Employer FAQ destination to /faqs/ and aligning it with the canonical desktop menu. Spanish Career Seekers navigation, page bodies, footer and language switching remain unchanged.

Verification adds a Spanish Career Seekers desktop/mobile comparison and checks every Employer submenu destination returns 200. The same PR includes the prior D-024 removal of language selectors on Employer pages.

Follow-up local checks: 65 focused checks passed, and the new Spanish navigation check passed after correcting its consent-banner lookup to use the Spanish UI. Lint/build/formatting passed. Final CI reruns all 138 tests.

## Publication verification

Owner approved merge/publication. PR #22 merged as f1a895649bd1f87603e64aa6994ae371d9b19dff; Vercel publication succeeded. All 138 PR CI tests passed. Three targeted browser checks passed against https://yourcnastory.vercel.app, covering all nine Employer pages at 1440/390px with no language selectors, retained Career Seekers language switching, and the Spanish Empleadores label with English desktop/mobile menu labels and working destinations.
