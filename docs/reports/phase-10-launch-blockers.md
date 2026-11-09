# Preliminary QA: launch blockers and remaining decisions

This is a current-state register for the 48 Career Seekers/shared pages. It is not final full-site Phase 10 acceptance. Employers is English only, content pending, links inactive. Phase 6/chatbots remain deferred.

| Priority | Finding / gate | Evidence / required next step |
|---|---|---|
| High | 10 legacy source URLs work on WordPress but fail on rebuild | Exact direct-301 proposal in docs/recommendations/phase-10-preliminary-redirects.json; owner question pending. Inactive until approved. |
| High | Spanish /es/empieza-tu-nueva-carrera/ is broken on source and rebuild | Determine approved intended destination; no guessed redirect. |
| Medium | Three missing deep-link destinations, 50 link occurrences | EN/ES Community Resources #cnap-flyer and CNA career entry #cusp are absent in approved archived source too. Choose valid targets/aliases with owner approval. |
| High | Employers content/build incomplete | Await final English Employer content, Phase 8 plan approval, form decision and build. Historical Spanish Employer URLs need explicit disposition; English-only scope is not redirect authorization. |
| High | Mailchimp and analytics/advertising still mocked/off | Owner configuration and approved safe live verification remain required. Retain GA4/Clarity, Ads, Floodlight and MNTN; no omission or activation here. |
| High | WCAG AA criteria unmet under retained D-004 styling | 80 of 192 axe states have only known contrast/color-only-link failures. Owner chose source styling; no renewed approval request or conformance claim. |
| Medium | Full-page visual parity unresolved | All 96 raw Phase 1 screenshot comparisons flagged; dynamic source/approved UI differences are documented, not a blanket pass. Review raw/representative evidence before sign-off. |
| Medium | Mobile performance / real-user evidence | Complete 54-run lab report supplies measured per-template exceptions. Field p75 INP/LCP/CLS and live-vendor overhead remain unavailable. |
| Medium | Native Safari/iOS, physical Android and screen-reader coverage | WebKit/viewport testing is not native/physical certification. Arrange actual device/AT journey checks for full Phase 10. |
| Medium | CSP and application security headers | Hosted HSTS/noindex verified; CSP, nosniff, referrer and permissions policies are absent. Inactive concrete proposals: docs/recommendations/phase-10-preliminary-security.md; CSP compatibility/enforcement needs separate review. |
| Medium | 32 source noindex directives | Preserved deliberately; review their desired launch status before changing robots/sitemaps. No silent indexing change. |
| Medium | Broader Search Console URL/document obligations | Phase 7's 159 explicit exceptions are not resolved by this limited pass. Employers, unattached MOUs and historical/demo/retired URLs require approved dispositions. |
| Medium | PDF search indexing unsupported | Existing Pagefind indexes HTML. Download links work; document text/search surrogates require separate approved work. |
| High | Privacy/counsel and Spanish native review pending | Current policy unchanged; draft disclosures are not legal sign-off. Handoff: phase-10-preliminary-spanish-review.md. |
| Deferred | Chatbot scope and implementation | Phase 6 remains deferred; Phase 9 depends on its engine. No chat-log/review-page security or chatbot QA claim. Owner must resolve launch chatbot scope. |

## Recommendation

Continue review and fix approved in-scope defects. **No-go for custom-domain cutover or whole-site launch sign-off** while the applicable gates above remain unresolved. This register does not block a separately authorized review-site publication, but no merge/publication is performed by this preliminary QA task. Do not change DNS, production indexing or external accounts.
