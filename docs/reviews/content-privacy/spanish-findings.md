# Spanish first-pass findings

Review status: **editorial proposals only; native-speaker and owner approval pending**. No Spanish site string was changed. These are current findings, not a reissue of the superseded preliminary handoff.

| ID | Current issue and evidence | Proposed action | Status |
|---|---|---|---|
| ES-01 | `PREGUNTAS FREQUENTES` remains in the raw Spanish Career Seekers menu (the Employer menu is intentionally English under D-025). | Change only the Career Seekers label to `PREGUNTAS FRECUENTES`, subject to owner/native approval. Keep its canonical path unchanged. | Proposed spelling correction |
| ES-02 | `/es/aspirantes/` uses informal `Te importa...`, `puedes...` alongside `Como CNA, brindará atención práctica...` and `Suscríbase a`. | Recommend a consistent respectful **tú** voice for Career Seekers/interface copy. Example minimal proposal: `brindará` → `brindarás`; review the incomplete `Suscríbase a` heading in context before approving `Suscríbete`. Do not batch-replace pronouns or alter quoted testimonials. | Reviewer to choose tone and exact edits |
| ES-03 | `Consulta los términos.` occurs three times on each of nine signup-bearing pages in the rendered text inventory. See inventory.json for exact paths. | Replace the duplicated labels with one verified, accessible terms link after the EN/ES SMS disclosure and Mailchimp setup are approved. Do not silently shorten the contractual disclosure or invent SMS terms. | SMS/content approval required |
| ES-04 | CNA terminology varies across preserved content, including `asistente de enfermería certificado` and `auxiliar de enfermería certificado`. | Choose preferred site terminology with the team and cross-check qualifications/job-title meaning. Flag edits individually; do not alter medical, eligibility, credential or salary facts through a global translation replacement. | Native/content review |
| ES-05 | Privacy page retains old third-party email contacts and asks for a password in its child-removal paragraph. | Replace with the approved bilingual privacy text after legal/owner approval. Confirmed draft contact is info@yourcnastory.org. Never publish an instruction to email a password. | High priority; proposed replacement only |
| ES-06 | Search, form, video, menu and privacy interfaces include newly authored Spanish. | Review all 61 exact current strings in spanish-interface.md, including placeholder tokens, state messages, terminology and layout fit. Preview/mock signup language is intentionally truthful now and must change only when live signup is implemented. | Native review pending |
| ES-07 | The 24 frozen Spanish page bodies include source-specific grammar, names, figures and testimonials beyond the high-confidence issues above. | Complete the page register with a named human reviewer. Review each English counterpart for intended meaning, but preserve source facts and quotations until owner-approved corrections are specified. | Full native review pending |

## Findings already resolved or intentionally retained

- Leaked SVG `.cls-...{...}` fragments: approved cleanup already applied to eight Spanish career-detail pages; the current 24-page rendered scan found no matching styling artifacts. Do not request the same approval again.
- Retired Vietnamese/Chinese form choices and inconsistent old English labels: current canonical form choices are **English / Español**, as already approved. `English` is the deliberate option value/label, not an automatic translation defect.
- Employer navigation: **Empleadores** remains the Spanish top-level label; the Employer submenu is English and links to English pages. This is owner-approved behavior, not missing translation.
- `CNAP PROGRAM` inside the English Employer branch is intentional. Do not automatically translate English menu fragments. Any occurrence elsewhere should be reviewed in its actual current context.
- `/es/abogado/`: historical Employer URL, not one of the 24 built Spanish pages. Its lifecycle decision belongs to remaining-legacy-url-dispositions.md, not a translation rename.
- Spanish FAQ aliases and privacy-preference aliases: approved redirect behavior already implemented. Do not change URLs as an editorial correction.

## Reviewer response format

For each correction, provide: page/catalog key; exact current text; exact approved replacement; reason; reviewer; owner approval/date. `Keep as-is` is a valid explicit verdict. Existing source JSON and metadata must not be overwritten merely to make a parity test pass.
