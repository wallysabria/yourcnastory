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
