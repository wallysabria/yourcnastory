# Phase 7 URL decision — Spanish FAQ alias

Approved by owner in chat on 2026-11-08; activated for both slashed and slashless aliases with a direct 301.

- From: `/es/preguntas-frecuentes-2/`
- To: `/es/preguntas-frecuentes/`
- Response: single-hop permanent 301; preserve query parameters as with existing redirects.
- Evidence: owner-supplied Search Console performance Pages row 52 has 2 clicks / 406 impressions. A fresh read-only GET to the old source returns 200 and declares canonical https://yourcnastory.org/es/preguntas-frecuentes/ and English counterpart https://yourcnastory.org/frequently-asked-questions/. The migration alias path currently returns 404 locally; the intended Spanish target already returns 200.
- Scope: this is the Career Seekers FAQ. It does not merge or activate the gated Employer `/faqs/` page.
- Benefit: preserve historical search traffic at a duplicate alias and direct it to the existing canonical, without new copy or a new page.

Explicit owner approval is required under CLAUDE.md §4.1/§7 before changing a URL disposition. Other historical/demo/Employer URL exceptions remain in the reconciliation report; this proposal does not authorize their redirects or content.

## Additional retired-language counterparts — proposed

Fresh source GETs identify three historical URLs whose declared English counterpart is /career-paths-in-long-term-care/: /zh/careerpaths/, /vi/careerpaths/ and /zh/职业路径/护理协调职业/. The current generic migration fallback sends them to homepage. Proposed: direct single-hop 301 to the declared existing English career index instead, covering slash and equivalent percent-encoding variants. Total exported demand: one click / 155 impressions. Exact paths, source rows and declared URLs are in phase-07-retired-counterparts.json. No Employer target or new copy; pending owner approval before activation.


Owner approved all three retired-language counterpart redirects on 2026-11-08; implemented as direct 301s with slash and percent-encoding case variants. Earlier pending status is superseded.
