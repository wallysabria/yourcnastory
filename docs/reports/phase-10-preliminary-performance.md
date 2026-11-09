# Preliminary QA mobile performance

54 cold mobile Lighthouse 13.6 runs, three per template/locale, on the published Phase 7 review alias. Historical source/Phase 5 medians use their preserved reports; hosting, cache, consent and capture conditions differ, so this is not a controlled causal comparison. TBT is not field INP; no real-user p75 CWV or live-vendor overhead claim.

| Page | Source LCP (s) | Phase 5 LCP (s) | Current score | Current LCP (s) | CLS | TBT (ms) |
|---|---:|---:|---:|---:|---:|---:|
| /careerpaths/careers-in-certified-nurse-assistant/ | 1.98 | 1.72 | 98 | 1.72 | 0.000 | 92 |
| /es/carreras/carreras-en-asistente-de-enfermeria-certificado/ | 1.99 | 1.72 | 98 | 1.71 | 0.000 | 95 |
| / | 3.07 | 3.60 | 86 | 3.67 | 0.000 | 175 |
| /es/ | 3.00 | 3.60 | 86 | 3.66 | 0.000 | 184 |
| /career-seekers/ | 5.62 | 4.20 | 84 | 4.27 | 0.000 | 99 |
| /es/aspirantes/ | 5.61 | 1.85 | 97 | 1.86 | 0.000 | 108 |
| /career-paths-in-long-term-care/ | 2.02 | 3.35 | 89 | 3.36 | 0.019 | 168 |
| /es/caminos-profesionales-en-el-cuidado-a-largo-plazo/ | 2.10 | 3.06 | 92 | 3.06 | 0.005 | 116 |
| /community-resources/ | 2.95 | 3.43 | 90 | 3.43 | 0.000 | 79 |
| /es/recursos-comunitarios/ | 2.95 | 3.43 | 87 | 3.88 | 0.000 | 80 |
| /privacy-policy/ | 2.02 | 3.07 | 91 | 3.05 | 0.000 | 150 |
| /es/politica-de-privacidad/ | 2.02 | 1.71 | 98 | 1.70 | 0.000 | 119 |
| /certified-nurse-assistant-program/ | 2.09 | 3.58 | 87 | 3.66 | 0.000 | 140 |
| /es/que-es-cuidar-a-largo-plazo/ | 2.10 | 3.06 | 91 | 3.13 | 0.000 | 170 |
| /earn-and-learn-la/ | 6.50 | 1.87 | 98 | 1.86 | 0.000 | 81 |
| /es/ganar-y-aprender-la/ | 6.54 | 1.85 | 98 | 1.86 | 0.000 | 84 |
| /frequently-asked-questions/ | 3.16 | 3.12 | 90 | 3.12 | 0.000 | 150 |
| /es/preguntas-frecuentes/ | 3.06 | 3.50 | 88 | 3.49 | 0.000 | 151 |

Budget counts out of 18: score ≥90: 11; LCP ≤2.5s: 6; CLS ≤0.1: 18; TBT ≤200ms: 18. Each nonpassing route remains an exception, not an averaged pass.

The two preliminary QA fixes change fragment resolution and privacy opener focus, not rendering/resource scheduling. These measurements describe the published baseline, not a claim of measured performance improvement from those fixes. First-party encoded JavaScript is checked separately in the final protected-cloud report; transfer bytes include response headers and are not interchangeable.


Final protected-preview first-party JavaScript: 205,894 encoded bytes (201.07 KiB) across eight resources; the 200 KiB budget remains unmet. Transfer bytes including headers: 208,294. Phase 5 encoded bytes were 205,760; the 134-byte increase is recorded, not hidden in transfer-size rounding.
