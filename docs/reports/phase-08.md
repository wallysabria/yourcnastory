# Phase 8 — partial English Employer build

Status: six approved pages implemented for review on phase-08-employers, based on published main. This is not full Employer-section or launch acceptance.

## Scope and owner approvals

Built /cna-certifications/, /employer-resources/, /cnap-employer-signup/, /cnap-awards/, /faqs/, /cusp-upskilling/ in English only. Owner approved current public-site rendered copy, original Microsoft Forms embed URL, D-013 FAQ styling and D-019 click-to-load Forms/Vimeo. Source snapshots captured 2026-11-16 into ignored _source/phase-08/.

/employers/, /train-and-gain/, /advocate/ remain held, unbuilt and unredirected. Existing historical Spanish Employer routes remain reserved; none has been migrated, deleted or redirected. No chatbot or database work is included. Employers chatbot and broader Employer AEO/Phase 9 remain deferred.

## Implementation

- Six verbatim content trees, matching source metadata and source head fields, local media/documents and scoped layouts. Preserved upload paths; 397 media references resolved with no import failures.
- Explicit approved-page allowlist controls rendering, shared links and search. Held/unapproved Employer destinations stay inactive even when the Employer flag is enabled. English-only pages emit no unavailable Spanish hreflang.
- Existing native FAQ presentation/answers reused. CUSP source tabs restored with desktop keyboard navigation, mobile accordion controls, correct panel references and visible active content. Empty source heading no longer creates an empty heading landmark. Source content records remain unchanged by these rendering corrections.
- Source-derived names distinguish multiple carousel landmarks. New external page links inherit target=_blank and noopener/noreferrer.
- Microsoft Forms and Vimeo URL destinations preserved; no iframe/provider request before explicit activation, no form submissions. Load controls/notices are English-only in content/ui/external-frame.json. External provider internals, submission success and provider cookies have not been certified.

## Verification

- npm run lint, npm run typecheck, npm run build: passed.
- node scripts/verify-content.mjs with QA_REPORT_PREFIX=docs/reports/phase-08: 54/54 exact content/metadata/link/image/anchor checks passed against captured sources. Invisible iframe fallback excluded symmetrically; original fallback remains in source records.
- All original 48 Career Seekers/shared content files compared byte-for-byte to main: unchanged.
- Selected unit and Chromium suite: 101 passed. Separate inert content-review/media/external-link suite: 5 passed.
- New Employer checks cover 1440px/390px containment, single h1, held/Spanish routes 404, inactive held-page links, visible FAQ answers, desktop/mobile CUSP panels and explicit external-frame activation.
- Rendered internal link/anchor audit: 36 checks, zero failures. See phase-08-internal-links.json. No external provider form was submitted.
- Source/local screenshots: 24 captures at 1440px and 390px, locally ignored docs/audit/screenshots/phase-08/. Geometry/index evidence: phase-08-visual-checks.json. FAQ and CUSP screenshots inspected; no pixel-perfect certification. Approved FAQ/embedding changes are intentional deviations.

## Accessibility and performance limitations

Inherited source color-contrast failures remain on cyan/white buttons, including newly active signup CTAs on the homepage and Employer pages. Owner previously chose source styling under D-004. Full violations are retained as axe test attachments; tests reject other violations and explicitly exclude the retained contrast rule. These passes do NOT establish zero axe violations or WCAG AA acceptance. New tab/landmark/empty-heading defects were fixed.

Single-run local mobile Lighthouse: performance 77–97, LCP 2.11–5.49s, CLS 0, TBT 74–117ms. Five pages exceed the 2.5s LCP target. Render-blocking source CSS contributes to the local mobile simulation; hosted preview measurement/optimization remains open. This is lab data, not field Core Web Vitals or performance acceptance. Details: phase-08-performance.json. Do not mark the whole phase launch-ready on these results.

Other unresolved items: external provider internals/submission verification; audit-only /cna-employers/ and calculator lifecycle decisions; held-page content and final full-section navigation; historical Spanish URL disposition; production analytics/consent legal review and full launch QA. No new redirect is proposed or enabled here.

## Review handoff

Draft PR: https://github.com/wallysabria/yourcnastory/pull/17

Protected branch preview: https://yourcnastory-git-phase-08-employers-wallysabrias-projects.vercel.app/

Deployment dpl_9ArMYwBwokasNHA7hbgvGDh319NB reached Ready. Authenticated FAQ request returned HTTP 200; other hosted route checks remain pending. Vercel CLI unexpectedly created a persistent automation bypass during that check; automatic review rejected further bypass use. The exact newly created bypass was revoked and its absence verified; other bypass settings were unchanged. No secret value was printed or stored in project files. Use normal Vercel reviewer sign-in; no public-access claim is made. No main merge, review-alias publication, DNS/cutover, paid calls or live tracking activation performed.
