# FAQ answer reveal fix

Reported on /frequently-asked-questions/. Reproduced on the published review site: clicking set aria-expanded=true and removed hidden from the panel, but computed display stayed none. The preserved Elementor accordion default beat the existing open-state display rule. Answer copy was present in the DOM. Prior tests asserted only aria-expanded, so they missed the visible failure.

Fix: make the existing open-panel display:block override important, just like the existing closed-panel display:none rule. Closed panels remain hidden; native click/Enter/Space handlers, panel IDs/ARIA, copy, URLs, metadata and design are unchanged. Shared accordion correction covers the EN Career Seekers FAQ and /es/preguntas-frecuentes/. Employers FAQ remains gated. Owner-authorized functional bug fix, not a phase advancement.

New four regression cases verify all 11 answers in each language at 1440px/390px: initially hidden, click opens and reveals actual text, Space closes, Enter reveals, click closes. Full suite: 74/74 passed. Lint/build/format pass. Four screenshot checks show two visibly open answers and nine hidden answers in both languages/widths. Evidence: faq-answer-visibility.json, faq-answer-visibility-tests.json and faq-answer-visibility/.

PR: https://github.com/wallysabria/yourcnastory/pull/14

Protected preview: https://yourcnastory-ivwg3n0wl-wallysabrias-projects.vercel.app/frequently-asked-questions/

Normal preview authentication retained; no temporary bypass credentials created. Browser evidence is from the local production build. No merge/publication or integration/indexing changes.
