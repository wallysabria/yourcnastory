# Decisions needed

Open decisions for the project owner. Do not guess (`CLAUDE.md` §7). When decided, record
the answer, who decided and the date, and move the row to **Decided**.

## Open

| ID | Decision | Needed by | Context | Raised |
|----|----------|-----------|---------|--------|
| Q-001 | Which `/wp-content/uploads/` paths must be kept exactly | Phase 3 | Until decided, every document keeps its exact path; nothing is deleted or renamed. | CLAUDE.md §7 |
| Q-002 | Microsoft Forms approach for `/cnap-employer-signup/` | Phase 8 | Default: keep the embed as-is. | CLAUDE.md §7 |
| Q-003 | Does a Spanish version of `/faqs/` exist? | Phase 8 | `/faqs/` (Employers) and `/frequently-asked-questions/` (Career Seekers) are separate pages. | CLAUDE.md §7 |
| Q-004 | Chatbot knowledge-base sources and refresh schedule | Phase 6 | KB is built from scratch, not ported from MxChat. | CLAUDE.md §7 |
| Q-005 | Anthropic account ownership and model choice | Phase 6 | Key lives in Vercel env vars only. | CLAUDE.md §7 |
| Q-006 | Chatbot test question set | Phase 6 | Expected at `_source/chatbot/test-set.md`. | CLAUDE.md §7 |
| Q-009 | Chat-log storage service (12-month retention) | Phase 6 | Needs a datastore; may be a paid service. | Phase 0 |
| Q-010 | Fluent Forms Pro and MetForm: which forms are live and where | Phase 1 (find) / Phase 4 (decide) | Both plugins are active; CLAUDE.md only covers Mailchimp and Microsoft Forms. | Phase 0 |
| Q-011 | Existing redirects source | Phase 1 | Quick Page/Post Redirect is inactive; Yoast Premium licence not activated. Redirects may only exist in the DB dump. | Phase 0 |

## Decided

| ID | Decision | Answer | Decided by | Date |
|----|----------|--------|------------|------|
| Q-000 | GitHub repo visibility | Public. Raw exports stay in gitignored `/_source/`; no personal data in docs, logs or reports. | Project owner | 2026-11-07 |
| Q-000b | Canonical host | `https://yourcnastory.org/` (apex). `www` currently 301s to apex. | Observed (live HEAD check) | 2026-11-07 |

## Phase 1 findings (2026-11-07)

| ID | Decision | Needed by | Evidence / status |
|---|---|---|---|
| Q-012 | Approve source-limited audit | Phase 1 | Owner approved proceeding without database.sql/uploads archive. Audit is conditional; full coverage is not claimed. |
| Q-013 | Retired-language translated slugs | Phase 1 | **Decided by owner in chat 2026-11-07:** use declared English counterparts; closest existing English parent when unavailable. Individual redirect rows remain proposals. |
| Q-014 | Legacy/demo/test page scope and URL disposition | Before Phase 2 manifest approval | Review docs/audit/section-decisions-needed.csv. Includes train-and-gain, cna-employers, calculator, campaign pages and The7 demo/review/archive pages. Nothing removed/consolidated. |
| Q-015 | Spanish Employers paths currently redirect | Before Employers build | /es/empresarios/ → English /employers/; /es/recursos-para-empresarios/ → /es/. Recover intended Spanish source from DB or confirm approved destinations. |
| Q-016 | Mobile vs desktop Employers FAQ destination | Foundation | Mobile Employers submenu points to /frequently-asked-questions/; desktop points to /faqs/. Confirm intended behavior without merging the pages. |
| Q-017 | Missing/nonreciprocal language pairs | Before manifest approval | Review docs/audit/language-pairs.csv. /purpose/ has no declared ES pair; /es/vocacion/ declares /vocation/, which redirects back into Spanish. No relationship inferred as an approved replacement. |
| Q-018 | Extra live advertising tags | Phase 5 | Ads/Floodlight/DoubleClick/Mountain observed beyond GA4/Clarity. Owner approves keep/drop plan; no tags recreated in Phase 1. |
| Q-019 | Preview analytics verification conflict | Phase 5 | Standing rules prohibit production analytics on previews; Phase 5 asks for DebugView verification on preview. Agree isolated test configuration or controlled production verification first. |
| Q-020 | Screenshot storage | Phase 1 handoff | PNGs retained locally in ignored docs/audit/screenshots/ (~50 MB); index/verification committed. Owner may select durable private artifact storage later. |
| Q-021 | Conditional popup/form settings | Before implementation | Export includes Woo popup templates and MetForm/Fluent Forms records; missing DB prevents proving all activation conditions. |
| Q-022 | Existing 404 destinations | Before manifest approval | Seven observed 404 URLs in docs/audit/issues.csv. No replacement destination guessed. |

Q-003 update: /faqs/ has no ES alternate in its HTML or the observed sitemap. This is **not proof of absence**; database/owner confirmation remains required.

No future phase is authorized by these audit findings.

## Phase 2 update
Q-007 / Q-008 resolved by owner in chat: use yourcnastory within existing wallysabrias-projects Hobby account; full Phase 2 and Vercel setup authorized. Project created and repository connected; protection retained, no paid upgrade/DNS cutover. Q-014/Q-017/Q-022 remain open: 48 known Career/shared route shells only, 172 redirect proposals deferred. Q-016 affects inactive Employers links only; destination decision remains open. Source-limited authorization continues; it does not resolve missing inputs.

Resolved Phase 2 hosting rows (owner, 2026-11-07): Q-007 selected existing wallysabrias-projects Hobby team; Q-008 authorized yourcnastory project/Git connection, main production branch, protected previews. No domain cutover. See phase-02 report and sanitized cloud evidence.

## Phase 3 source-precedence gate
Q-023 (decided by owner in chat, 2026-11-07): use current rendered public copy/punctuation as the reader-visible authority, with WXR structure/metadata cross-checks. Example: /community-resources/ WXR straight apostrophe in patients' lives vs rendered curly apostrophe. Career templates add headings/excerpts outside WXR post bodies. All 48 approved pages snapshotted successfully; see docs/reports/phase-03-source-review.json. Owner selected rendered live copy and punctuation; WXR remains the structure/metadata cross-check.

Phase 3: Q-023 resolved by owner: rendered live copy/punctuation is authoritative. Missing database/uploads archive remains an accepted limitation. Preserve all document paths; the selected current pages reference externally hosted documents, whose URLs remain unchanged. Legacy/demo scope and all Employers decisions remain deferred. Two WXR OG image resolution variants retain the currently served original-image URLs; see phase-03-wxr-crosscheck.json.

## Foundation integration — 2026-11-07
Owner explicitly approved merging foundation PR #3 into main and triggering the Vercel production deployment. Merged as d199e179857b9736ed80a56cbf9b81f8de6c2194. Main CI passed; production is ready at https://yourcnastory.vercel.app/ with noindex, no analytics, 48 verified shells and 250 verified redirects. No DNS changes were made. Phase 3 PR #4 remains open; no approval to merge it or start Phase 4 is inferred.

Phase 4 plan approved by owner, including merge/deployment of Phase 3 PR #4, nine templates / 48 URLs, mock-only signup while audience mappings/test target are missing, bilingual Pagefind search, 96 screenshot comparisons, and source-styled pause controls. PR #4 merged; Phase 4 branch is phase-04-build. No live Mailchimp connection is authorized without the missing setup and approved test target.

## Phase 4 current gates (2026-11-08)

- D-004 declined: owner instructs retaining source contrast/link styling and flagging the resulting axe failures. Zero-axe/WCAG AA acceptance remains unmet for these inherited failures.
- Mailchimp audience setup remains missing at _source/integrations/mailchimp/. Mock only; audience ID, API server prefix/key environment names, verified merge fields/tags/groups/SMS handling and approved test audience/tag are required before live connection. No live submissions performed.

## Phase 4 integration and Phase 5 inputs — 2026-11-08

Owner approved merging/deploying Phase 4 PR #5. Merge 01b1dc2758aa3a606a9c992023a793a15f4658f7 is deployed at yourcnastory.vercel.app; all 48 pages, bilingual search and reduced-motion grids were verified. This is not a blanket pixel-parity/zero-axe claim; D-004 remains declined and the documented visual flags remain review items.

- Q-025 resolved: owner confirmed GA4 Property 407144160 / Measurement G-RC2WSP3DYG and Clarity yr1ps67xpa. Stored in ignored _source/integrations/ids.md. Owner authorized creation of the missing public tag audit; six sanitized scenarios are complete.
- Q-026 open: owner creates/selects a clean replacement GTM container and supplies its ID; no agent account changes.
- Q-027 open: approve docs/integrations/tag-plan.md, including proposed omission of two Ads destinations, two Floodlight configurations and MNTN. None have been changed on the source site.
- Q-028 open: resolve preview DebugView validation without production analytics. Proposed protected isolated QA deployment with non-production GA4/Clarity IDs; otherwise defer live evidence and use mocks. Production IDs must not be silently tested on ordinary previews.
- Phase 5 implementation and new Lighthouse development tooling await plan approval. Mailchimp audience configuration remains missing/mock-only. D-004 is not reopened by the Phase 5 plan.

## Phase 5 owner revisions — 2026-11-08

Q-026 resolved: reuse existing GTM-TLC2T6FQ, also confirmed by the owner screenshot. Q-027 resolved for scope: do NOT omit Google Ads, Floodlight or MNTN; retain existing campaigns and exact verified mappings. The earlier omission proposal is superseded. Q-028 resolved: use mocks and defer live verification; no separate test IDs requested now. Revised overall Phase 5/tag plan approval remains pending, including separate analytics/advertising consent. Owner export/configuration is needed before real container use, and the agent makes no account/workspace changes or publication.

## Phase 5 implementation approval — 2026-11-08

The owner explicitly approved the revised Phase 5/tag plan. Earlier pending-plan text is superseded. Reuse GTM-TLC2T6FQ; retain Ads/Floodlight/MNTN; implement separate analytics/advertising choices with mocks and deferred live verification. Exact owner-controlled campaign mappings and consent configuration remain prerequisites for future live use. No new account IDs are requested for mock implementation.

D-006 resolved: owner approved click-to-load external inline video players. No remaining approval gate for that implementation.

## Phase 5 review handoff — 2026-11-08

Implementation is complete for review under the approved revised plan. Phase 5 merge/launch and Phase 6 remain unapproved. Retained vendor live verification is explicitly deferred; owner export and per-category configuration remain future activation gates. D-004 remains declined; LCP/score and manual assistive-technology limits are documented in phase-05 reports. Counsel review is required before release. No further input is required to finish this mock implementation.

## Phase 6 deferred / Phase 7 intake — 2026-11-08

Owner explicitly deferred Phase 6 and approved proceeding to Phase 7. Chatbot plan/test/storage proposals remain saved on phase-06-chatbot-career-seekers; no account, database, paid calls or chatbot code. Phase 7 branch starts from published main. Required _source/seo/ is missing: last 16 months Search Console pages/queries and indexing report are needed. Per the Phase 7 prompt, stop before implementation and request these inputs. Indexing remains disabled; Employers remain gated.

## Phase 7 inputs received — 2026-11-08

Owner provided the Search Console performance/indexing workbooks in Migration. Required input gate resolved. Performance covers 2025-07-07 through 2026-11-06 (332 page rows; 1000 query rows without page-query pairing). Indexing provides reasons/totals but no URL examples. Proposed Phase 7 plan and future AI-crawler policy await approval. Additional issue examples are optional diagnostic input, not invented evidence. Exact document scope/ambiguous URL dispositions remain approval gates; Employers and Phase 6 remain deferred.

## Phase 7 approved — 2026-11-08

Owner approved the Phase 7 implementation plan and chose allow search/discovery, block model training for eventual launch. Staging remains blocked/noindex. Newly evidenced Spanish FAQ alias proposal is docs/recommendations/phase-07-url-decisions.md; approval pending before activation. Every exported URL has source/local probes; gated/historical exceptions remain explicit.

Owner approved the Spanish Career Seekers FAQ alias 301 on 2026-11-08. Both slash variants now target /es/preguntas-frecuentes/ directly; no Employer FAQ consolidation.

Phase 7 checks: all 59 regression tests pass; 48 metadata/heading/source-copy checks, 96 controlled visual views and 192 accessibility states checked. An isolated launch build exposed and fixed an invalid empty Next header rule; launch checks passed and staging build was restored. No Vercel launch/indexing flag, account, DNS or live tracking setting changed. Model-training restrictions apply to four documented vendor controls, with Google-Extended mixed-purpose limitation documented. Source noindex overrides, Employer assets and historical URL dispositions remain future review/launch gates. Three newly evidenced retired-language redirects are pending their separate owner reply.


Phase 7 final owner decision — 2026-11-08: the three retired-language direct redirects in phase-07-retired-counterparts.json are approved and implemented (including slash and percent-encoding case variants). Destinations use declared English counterparts. No page copy or styling changes. Phase 6 and Employers remain deferred.


## Phase 7 publication — owner approved 2026-11-08

Owner explicitly requested merge, lint and publish. PR #7 merged as d8e2c3f995f17d27b76caa4836e7d9342df72b37. Lint/build and post-merge CI passed. Vercel production deployment https://yourcnastory-oer5dgshv-wallysabrias-projects.vercel.app is READY and owns https://yourcnastory.vercel.app/. Public-alias verification passed all 48 pages, 552 assets, five SEO endpoints, ten Phase 7 redirect variants with query preservation, EN/ES search, retained consent mocks, GPC and click-to-load video checks. Evidence: docs/reports/phase-07-production-checks.json. Indexing remains blocked; production tracking stays off/mocked. No custom-domain cutover. Earlier unmerged/unpublished statements describe the review handoff and are superseded by this approval. Phase 6 remains deferred and Employers remain gated.

## Employer scope clarification and preliminary QA — 2026-11-08

Owner confirmed Employers is English only and its content is pending/not ready. This supersedes bilingual Employer implementation assumptions, but does not authorize deletion or redirection of existing Spanish Employer URLs. Phase 8 remains on hold; links remain inactive. Phase 6 remains deferred. Owner approved preparing a limited Phase 10 QA pass for existing Career Seekers/shared EN/ES pages. Concrete plan: docs/phases/phase-10-preliminary-plan.md; implementation awaits its approval. Full-site Phase 10 acceptance and launch remain deferred.
