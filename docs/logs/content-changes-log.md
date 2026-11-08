# Content changes log

Every change to ported copy (English or Spanish) is recorded here. The only change permitted
without separate approval is removing job-board references (`CLAUDE.md` §4.4). Removed links
are **not** replaced.

| ID | Page URL | Language | Change type | Original text / link | After | Reason | Approved by | Phase/date |
|----|----------|----------|-------------|----------------------|-------|--------|-------------|------------|

## Phase 1 — P1-AUDIT-NO-CHANGES

No production copy or links changed. Job-board references are inventoried in docs/audit/jobboard-references.csv; removal is deferred to the approved content phase. Reports and URL inventories are audit artifacts, not ported page content.

## Phase 2
Global header/footer and required route headings copied from audited public source; page bodies not ported. No copy rewritten and no job-board removal occurred in this phase. Source/provenance: docs/reports/phase-02-global-provenance.json.

## Phase 3 — job-board removals

Only these source substrings or link-and-label elements were removed; nothing was substituted. Other privacy-policy wording is retained. Full character-exact removal records: docs/reports/phase-03-jobboard-removals.json.

| Page | Kind | Original removed text/link | Result |
|---|---|---|---|
| /privacy-policy/ | text-substring | the QCHF/CAHF Job Bank and/or | Removed; no replacement |
| /privacy-policy/ | text-substring | the job bank or | Removed; no replacement |
| /privacy-policy/ | text-substring | the job bank and/or | Removed; no replacement |
| /privacy-policy/ | text-substring | The information submitted by users to QCHF via the QCHF/CAHF Job Bank will be accessible by QCHF member entities for the purposes of employee recruitment, and may be disseminated to or accessed by QCHF/CAHF member entities without the consent of the individual submitting their information to the QCHF/CAHF Job Bank. | Removed; no replacement |
| /career-advancement/ | link-and-label | Learn About the Earn and Learn Program — https://jobboard.yourcnastory.org/?_ | Removed; no replacement |
| /es/politica-de-privacidad/ | text-substring | la bolsa de trabajo de QCHF/CAHF y/o | Removed; no replacement |
| /es/politica-de-privacidad/ | text-substring | la bolsa de trabajo o en | Removed; no replacement |
| /es/politica-de-privacidad/ | text-substring | la bolsa de trabajo y/o | Removed; no replacement |
| /es/politica-de-privacidad/ | text-substring | La información enviada por los usuarios a QCHF a través de la Bolsa de Trabajo de QCHF/CAHF será accesible por las entidades miembro de QCHF con el propósito de reclutar empleados, y puede ser difundida o accedida por las entidades miembro de QCHF/CAHF sin el consentimiento del individuo que envía su información a la Bolsa de Trabajo de QCHF/CAHF. | Removed; no replacement |
| /es/avance-profesional/ | link-and-label | Aprende sobre el programa Earn and Learn — https://jobboard.yourcnastory.org/?_ | Removed; no replacement |

## Phase 4 rendering (2026-11-08)

No page-body rewrites. Frozen Phase 3 JSON remains unchanged. Native form retains original field IDs/labels and SMS disclosure; language preference is English / Español only. Source integration stylesheet ID is infrastructure; removed language radio IDs mce-MMERGE32/33 intentionally retire with those controls. All section anchors remain. New interface strings live in content/ui/ and Spanish strings are enumerated in spanish-review-log.md. Decorative source SVG artwork is static, self-hosted; no legacy runtime scripts.

Phase 4 final visual QA found generic legacy chat IDs/classes that the original source filter did not recognize: floating-chatbot, floating-chatbot-button, pre-chat-message, chat-notification-badge and their EN/ES ID variants. The native renderer and search now exclude these retired interface roots under content/migration/legacy-ui-policy.json; each affected root is recorded in phase-04-legacy-ui-removals.json. Frozen content/pages records stay unchanged. No reader page body or SMS disclosure is rewritten; no chatbot replacement is built in Phase 4.

## Phase 5 read-only input work — 2026-11-08

Confirmed IDs recorded in ignored inputs; six public EN/ES/GPC tag-observation scenarios completed without live lead/application submissions or account configuration changes. No product copy, privacy policy, tracking or consent implementation changed. The proposed tag plan and consent UI copy are review documents only; advertising omissions have not been applied to the source site.

Phase 5 planning revision (2026-11-08): supersede the advertising-omission proposal; retain Ads/Floodlight/MNTN and selected existing GTM-TLC2T6FQ. Mocks and deferred live verification are owner-selected. Only planning documents/copy proposals changed; no source or deployed tracking settings changed.

## Phase 5 — 2026-11-08

New reusable consent interface copy is in content/ui/privacy.json, approved under the revised plan/D-005 and subject to counsel review before release. Source article/page JSON, URLs, policy bodies and original media are unchanged. Manrope is delivered as WOFF2 generated from the existing variable TTF; original font/license retained. Adjacent source CSS resources are bundled in their original order; selectors and declarations are unchanged. Lighthouse 13.6.0 is an audit-only dependency; ignored isolated wawoff2 2.0.1 is a build-only font compression helper (MIT), with no runtime dependency.

D-006 approved: added two original YouTube provider thumbnails, with source URL/hash provenance in content/integrations/external-video-posters.json. Reused the already imported original Vidyard poster and existing Play video / Reproducir video strings. No new media artwork or source copy.

Phase 5 final verification: all 48 body-copy/anchor checks pass. Fixed the mobile policy contents panel first-paint collapse so it matches the already approved final mobile state without a hydration shift. No final appearance, copy or interaction change.

## Phase 7 planning — 2026-11-08

Read-only analysis of owner-supplied Search Console XLSX exports; originals unchanged and private inputs ignored. Sanitized coverage summary and proposed SEO/AEO plan saved. No page body/metadata/URL/alt text or workbook contents changed. Content recommendations will remain proposals.
