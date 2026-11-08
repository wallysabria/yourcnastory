# Phase 5 mobile performance

Measured 2026-11-08 with Lighthouse 13.6.0, fresh serial Chrome profiles, simulated mobile throttling, 390×844, three cold runs per representative. Nine templates × EN/ES = 18 routes. Baseline: 54 source WordPress + 54 Phase 4 Vercel runs. After: 54 direct protected Vercel runs; six targeted policy reruns after the contents stability fix. All completed successfully. Original and refined results are retained.

## Medians

Score / LCP seconds; CLS and TBT milliseconds are final native results.

| Route | WordPress | Phase 4 | Phase 5 | CLS | TBT ms |
|---|---:|---:|---:|---:|---:|
| /careerpaths/careers-in-certified-nurse-assistant/ | 97 / 1.98 | 98 / 1.88 | 98 / 1.72 | 0 | 110 |
| /es/carreras/carreras-en-asistente-de-enfermeria-certificado/ | 97 / 1.99 | 98 / 1.88 | 98 / 1.72 | 0 | 100 |
| / | 91 / 3.07 | 86 / 3.84 | 88 / 3.60 | 0 | 114 |
| /es/ | 92 / 3.00 | 85 / 3.86 | 88 / 3.60 | 0 | 113 |
| /career-seekers/ | 73 / 5.62 | 97 / 2.05 | 84 / 4.20 | 0 | 89 |
| /es/aspirantes/ | 71 / 5.61 | 97 / 2.03 | 98 / 1.85 | 0 | 85 |
| /career-paths-in-long-term-care/ | 98 / 2.02 | 90 / 3.23 | 91 / 3.35 | 0 | 109 |
| /es/caminos-profesionales-en-el-cuidado-a-largo-plazo/ | 98 / 2.10 | 90 / 3.24 | 93 / 3.06 | 0 | 105 |
| /community-resources/ | 92 / 2.95 | 88 / 3.76 | 90 / 3.43 | 0 | 95 |
| /es/recursos-comunitarios/ | 92 / 2.95 | 89 / 3.64 | 90 / 3.43 | 0 | 98 |
| /privacy-policy/ | 98 / 2.02 | 91 / 3.22 | 93 / 3.07 | 0 | 93 |
| /es/politica-de-privacidad/ | 98 / 2.02 | 86 / 3.22 | 98 / 1.71 | 0 | 94 |
| /certified-nurse-assistant-program/ | 97 / 2.09 | 98 / 1.87 | 89 / 3.58 | 0 | 92 |
| /es/que-es-cuidar-a-largo-plazo/ | 97 / 2.10 | 90 / 3.22 | 93 / 3.06 | 0 | 100 |
| /earn-and-learn-la/ | 71 / 6.50 | 98 / 1.87 | 98 / 1.87 | 0 | 72 |
| /es/ganar-y-aprender-la/ | 72 / 6.54 | 98 / 1.88 | 98 / 1.85 | 0 | 73 |
| /frequently-asked-questions/ | 86 / 3.16 | 87 / 3.67 | 92 / 3.12 | 0 | 96 |
| /es/preguntas-frecuentes/ | 90 / 3.06 | 87 / 3.67 | 90 / 3.50 | 0 | 96 |

## Budget results and exceptions

- Mobile score >=90: 14/18. Exceptions: /, /es/, /career-seekers/, /certified-nurse-assistant-program/.
- Lab LCP <=2.5s: 6/18. Every route above the target remains an explicit exception, visible in the table. No site-wide good-CWV claim.
- CLS <=0.1: 18/18. Both policy pages improved from 0.1404 in the first after-run to 0 after a nonvisual first-paint contents fix.
- TBT <=200ms: 18/18. TBT is a lab proxy, not field INP. Field p75 INP/LCP/CLS are unavailable for the migration and require post-launch real-user data.
- Initial script transfer is about 203 KiB including response headers and the protected-preview feedback request. The 200 KiB compressed-body budget is assessed separately in the final cloud resource timing below; transferSize is not encodedBodySize.

Final first-party script encoded bodies: 200.94 KiB across 8 resources; transferred bytes including headers: 203.28 KiB. The encoded-body budget remains an explicit exception.

## Interpretation

The first-visit consent paragraph becomes the LCP candidate on the short-header English Career Seekers and CNA Program pages. It appears after privacy-state hydration, increasing those pages versus Phase 4. The approved explanation is retained; removing consent copy or briefly displaying a banner to saved-decline/GPC visitors was not used to improve a score. Home, index/resources/FAQ and some policy/header routes retain >2.5s simulated LCP. Further critical-path/header rendering work remains before claiming the target, with source visual behavior preserved. This report records these exceptions rather than claiming acceptance from an overall average.

The existing Manrope variable TTF (164,700 bytes) is delivered as WOFF2 (53,652 bytes). Eight old-font/new-font screenshots had zero changed pixels; original font/license retained. Source CSS bundles preserve exact ordered bytes for all 48 routes and reduce page stylesheet resources to one or three plus the shared font sheet. Home fallback image is preloaded. No source copy, URLs or original media were removed.

D-006 removes passive YouTube/Vidyard loads. Community Resources median total script transfer dropped from roughly 1.4 MiB EN / 1.8 MiB ES in Phase 4 to about 203 KiB. This excludes vendor cost after a requested Play. Mock optional-consent checks covered 54 fresh contexts (three per representative): no added script resources and no external hosts when granting both optional categories. Click-to-two-frame timings include automation overhead and are not field INP or isolated CPU estimates. Actual GA4/Clarity/ad overhead and delivery remain unverified because live verification was explicitly deferred.

## Reproduction and limits

Run scripts/audit-performance.mjs baseline for the source/public Phase 4 baseline only when that alias still points to Phase 4. Run cloud/another named phase with PERF_ORIGIN set to a review deployment; the ignored wrapper creates temporary host-only authentication, redeploys the preview to apply it and revokes access in finally. Authentication cookie/secret values are never written to tracked reports or forwarded to vendor origins. Lighthouse's installed default clearStorageTypes preserves authentication cookies while each run starts a fresh profile and cold cache. Vercel authentication and optional preview feedback are environment overhead; the main public alias remains Phase 4 until merge approval.

The source uses its existing pre-consent tags; Phase 4 has no consent banner; Phase 5 includes the approved banner and mocks. Hosting, cache timing and these intentional differences prevent treating the result as a controlled causal experiment. Same Lighthouse settings and per-route medians allow a useful lab comparison, not a field-CWV certification. Navigation wait is bounded at 15 seconds and warnings are retained. No lead forms were submitted.

Local uncompressed Next static-resource diagnostics are retained separately and excluded from final hosted comparisons. All raw performance reports retain metrics, resource host/path/byte counts and warnings, not cookies, query values or event payloads. See phase-05-performance-summary.json and the baseline/cloud/cloud-policy raw JSON files.
