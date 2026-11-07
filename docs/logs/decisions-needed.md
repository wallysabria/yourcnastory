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
| Q-007 | Vercel plan tier (Hobby vs Pro) and account owner | Phase 2 | Vercel Hobby is for personal, non-commercial use; client work likely needs Pro (paid). | Phase 0 |
| Q-008 | Vercel project setup approval | Phase 2 | Proposed: one project `yourcnastory`, Git import, `main` = production, previews protected + `noindex`. CLI not yet installed; owner runs `vercel login`. | Phase 0 |
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
