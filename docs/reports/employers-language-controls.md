# English-only Employer language controls — D-024

Owner requested removing alternate-language options from every Employer page. The shared route layout passes an explicit section-based flag to the header; Employer routes emit neither the desktop language menu nor the mobile language branch. Future Employer pages follow the same rule. Career Seekers and shared-page language controls remain unchanged.

No page copy, translations, metadata, URLs or integrations changed. Source styling retained. The change removes the prior disabled Español option rather than hiding it with CSS.

Verification: npm run lint and npm run build passed; formatting check passed. Browser coverage iterates all nine approved Employer pages at 1440 and 390px and checks that no desktop/mobile language controls are rendered; it also verifies the Career Seekers Spanish destination remains available. Existing header navigation, mobile, accessibility and Employer regressions are included in the focused run.

Preview/PR: pending deployment. Not merged or published.

Focused browser run: 56 passed (all nine Employer pages plus shared/Career Seekers header and navigation regressions).
