# Phase 6 plan — Career Seekers chatbot (proposed)

Prepared 2026-11-08. Planning only; **not approved for implementation**. Owner explicitly authorized merging/publishing Phase 5 and proceeding to Phase 6. Phase 5 PR #6 merged as 7ec7e686f5df405add69960b5315c1db94cbd272. The public Vercel alias passed 48-page/534-asset checks, EN/ES consent, retained vendor mocks, GPC and passive-media blocking. Live analytics remains disabled; no DNS/domain cutover occurred.

## Input gates

`_source/chatbot/` does not exist and the authoritative test set remains unapproved. Owner approved using Career Seekers section content only on 2026-11-08; this narrows and supersedes the original homepage/shared-content proposal. Owner requested a storage proposal for approval. Refresh details, factual answer rubrics and other owner questions remain pending. No API key was read or requested in chat. Anthropic account ownership, model, spend ceilings, durable storage/account and alert destination are undecided. Existing Mailchimp mappings/test destination remain missing, so signup must remain explicitly mock-only until separately configured.

The Phase 6 prompt and CLAUDE.md §6/§7 require approval of this plan and decisions before implementation. Do not create services/accounts, provision storage, make paid model calls, publish a chatbot to preview or change source copy while these gates are open.

## Proposed source scope and retrieval

Use only approved EN/ES page bodies classified as Career Seekers. Exclude the homepage, shared/privacy pages, Employers pages/blocks, signup fields/disclosures as answer material, retired UI, job-board references and all external content. A link from a Career Seekers page does not approve the linked external page/document as knowledge. Only separately approved, imported in-scope documents may be added later. CUSP material is usable only if an approved Career Seekers source actually supports it; otherwise use the contact fallback while Employers stays gated.

Produce a source manifest with exact route, language/counterpart, heading/anchor, checksum, update date and approval status. Chunk by headings, preserving source text and attribution. Rebuild from repo content during deploy; no runtime browsing or arbitrary user URLs. A small deterministic lexical index and bilingual matching rules avoid a separate embeddings service initially; evaluate retrieval quality before accepting this approach. Source documents/PDFs must have a readable imported copy, permission and scope review before inclusion; link-only/failed extraction never becomes invented knowledge. External sources remain excluded; any later addition and refresh schedule require separate approval.

The draft evaluation matrix is docs/recommendations/phase-06-test-set-draft.md. It is an approval proposal, not the missing owner's authoritative source file. Expected factual assertions will be grounded in reviewed source spans and frozen before the live eval, not written from model memory.

## Engine and data flow

One server-only engine with per-bot configuration (scope, approved sources, eligible routes, prompt, locale strings and feature gate). Career Seekers enabled only after the agreed eval is approved. Employers remains disabled; Phase 9 adds configuration rather than a second engine.

Flow: visitor opens lazy UI → explicit chat-logging disclosure → same-origin bounded request → signed session and bot/rate checks → redact input before storage and, where possible, before provider transmission → retrieve approved same-language chunks → reserve worst-case spend atomically → server-side Anthropic request → validate answer length, source IDs and output safety → redact again → store structured record and usage → return text and validated source links. The signup handoff uses the existing component/route directly; no form fields enter chat payloads or logs.

The model has no browsing, code execution, arbitrary URL fetch or action tools. User text and retrieved documents are untrusted data, never system instructions. Server chooses bot and source scope; client cannot enable Employers or supply prompts. Return at most two paragraphs; ground every factual claim in retrieved material. Reject invented or unsupported sources, numbers, names and links. Use deterministic localized fallback/contact and employer redirect while gated. Medical/legal/individual eligibility decisions are refused; distress handling follows separately reviewed emergency/crisis wording and source verification. Do not publish unverified helpline details.

## Model proposal and indicative cost

**Recommended candidate: Claude Sonnet 5.5 (`claude-sonnet-5-5`)** for bilingual grounded answers and nuanced scope handling; approve only after the evaluation. Haiku 5.5 is a lower-cost comparison candidate, not an automatic paid fallback. Confirm availability and version behavior against the owner's account before pinning; no silent model migration.

Official pricing checked 2026-11-08: Sonnet 5.5 $2/input MTok and $10/output MTok. Haiku 5.5, for prompts <=100k tokens, $0.10/input MTok and $0.50/output MTok. [Model comparison](https://platform.claude.com/docs/en/models/overview), [pricing](https://platform.claude.com/docs/en/about-claude/pricing).

Illustrative uncached usage, **not measured site traffic**: 6,000 input + 500 output tokens per turn, four turns/session:

| Candidate | Per turn | 100 sessions/month | 1,000 sessions/month |
|---|---:|---:|---:|
| Sonnet 5.5 | $0.017 | $6.80 | $68.00 |
| Haiku 5.5 | $0.00085 | $0.34 | $3.40 |

These exclude eval calls, retries, storage/hosting and taxes. Actual costs depend on measured tokens/traffic; no cache discount is assumed. Proposed output/context caps and actual provider accounting must reconcile before live use. Owner supplies daily/monthly ceilings, account/billing ownership and permission for a bounded eval budget. No paid requests until these are approved and the key is entered by the owner as ANTHROPIC_API_KEY in the appropriate environment (never chat or tracked files).

## Storage and retention proposal

Prefer an existing owner-controlled Postgres database if suitable. Otherwise propose a separate **Neon Postgres** project through Vercel Marketplace, subject to owner approval/account setup. One durable database can support redacted sessions, review/report queries and atomic shared limits/spend reservations, avoiding an extra Redis account. [Vercel storage](https://vercel.com/docs/storage), [Neon pricing](https://neon.com/pricing).

Neon's published Free plan currently includes 1 GB storage and 100 CU-hours per project/month. This is a candidate evaluation allowance, not a guarantee of free production operation; frequent counters may prevent idle savings. No paid upgrade/auto-upgrade or account creation without approval. Separate fake/test data from production; confirm region, backups/deletion windows, permissions and vendor terms. Database failure must fail chat closed rather than bypass spend controls or lose mandatory logs.

Store random session ID, timestamp/expiry, locale, allowlisted page path, redacted messages, approved source IDs, fallback/signup flags, latency and token/cost accounting. Never store form values, raw IP, secrets or unredacted model/provider errors. Redact email, phone, ZIP and street addresses before every persistence path; best-effort names need explicit residual-risk review. Redact search queries and CSV output too. Keep raw messages out of server logs/observability. The provider may process inputs even when local logs are redacted; counsel must review disclosure and vendor retention separately.

Enforce 12 **calendar months**, not an arbitrary 365-day approximation: query-time expiry excludes expired sessions immediately, insertion computes expiry, a daily authenticated maintenance task deletes expired rows, and every active request can perform bounded cleanup. Include messages/derived question summaries/export jobs, backups and stale test branches in the retention review. Vercel Hobby legacy cron is daily with imprecise scheduling; do not rely on it for an exact deletion deadline. [Vercel scheduling limits](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing). Expired records are unreadable even if maintenance is delayed; alert and fail safely if cleanup is unhealthy.

## Limits, spend and abuse controls (proposed defaults)

- Request body <=16 KiB; user message <=2,000 characters; maximum 12 user turns/session; one in-flight request/session; bounded retrieved context and output.
- Proposed initial 6 requests/minute/session and 30/hour/visitor, plus short-lived salted network-abuse buckets. Owner may tighten after traffic review. No durable counter depends on function memory.
- Signed HttpOnly/Secure/SameSite session cookie, same-origin/CSRF checks, bounded age and replay protection, honeypot/timing checks and request limits. Evaluate deployment-native bot protection; accessible verification and any additional vendor are separate proposals if needed. Cookie reset alone must not reset network/spend caps.
- Daily and monthly budget reservations occur atomically **before** model calls, including concurrent requests and eval traffic. Reserve maximum permitted billable usage; settle from actual usage. Keep uncertain timeout reservations conservative; no automatic retry that can double-bill. Database or budget errors produce a localized unavailable state.
- Warn at agreed usage/spike thresholds through an owner-selected authorized channel. Do not create email/Slack destinations or send alerts until authorized. Recommend a separate provider Console limit as a backstop, not a substitute for code enforcement. Configuration defaults fail closed when budgets/model/key/storage are missing.

## Logs, internal review and reporting

Implement a noindex internal review area with server-side password authentication, secure expiring sessions, hashed secret handling, login rate limits and CSRF protection. Protect **every** review API, search, summary and CSV route; hiding the page is insufficient. Use no-store headers, bounded pagination/filters, validated queries and spreadsheet-formula-safe CSV export. Owner supplies the review secret outside chat. Session browser/search/filter/export and topline report show sessions, redacted top/unanswered questions, fallback rates, signups, locale split, latency and usage. Reports must identify mock signups; no false marketing conversions.

A failure to store a required redacted transcript must not be presented as a successful fully logged chat. Define transactional pending/completed/failed turn records and reconciliation. Never put production transcripts in repo artifacts, preview fixtures or developer screenshots.

## UI and signup

Propose D-007 separately before shipping: source-style floating launcher and responsive chat dialog, lazily loaded only on approved Career Seekers routes; no Employers activation. Match existing visual references with clear focus/keyboard behavior, Escape/restore, labeled input/status, reduced motion and accessible errors. Prepare a concrete EN/ES prototype and exact new UI strings for approval. Avoid loading the engine or optional analytics on initial page view. Test that chat placement does not obstruct consent or navigation.

Disclose logging and link the policy before sending a message. Actual policy updates remain counsel-gated; do not state unimplemented redaction/retention as existing practice. Use consent-aware Phase 5 chat_open/chat_message_sent/chat_signup_success metadata only, with no messages/form values. Mock or duplicate signups never count as live success. Reuse the native signup component; existing missing Mailchimp mappings remain a live-connection gate.

## Evaluation and delivery gates

Proposed acceptance: >=95% reviewed factual/citation correctness; 100% deterministic URL allowlisting, <=2 paragraphs, locale, forbidden-scope handling, fixture PII redaction and budget/rate enforcement. Any critical safety, PII leakage, authorization bypass, unsupported link or overspend failure blocks release regardless of average score. Thresholds and bilingual expected answers need owner approval before evaluating.

Use approved EN/ES factual cases, missing evidence, ambiguous questions, prompt injection in user/retrieved text, source conflicts/staleness, Employers redirects, individual eligibility, distress, form isolation and redaction fixtures. Unit/integration mocks exercise timeouts, storage failures, race conditions, retries, retention boundaries, authenticated review/export and consent-aware chat events. Live eval uses a separately approved small spend allowance and actual model; report human review and nondeterministic repeats. Mock pass rates do not establish model quality. Test names/addresses are synthetic and never committed as production logs.

Delivery sequence after approvals: source manifest/test answers → retrieval/redaction/budget tests → shared server engine and fake adapters → protected review/reporting → approved D-007 UI → bounded live evaluation → owner approval of results → enable for protected client preview → regression/accessibility/performance/content checks, logs and Phase 6 report/PR. Do not publish a chatbot for client preview before result approval; a feature gate remains off in ordinary previews meanwhile. No merge or next phase without approval.

Proposed new runtime libraries, only after plan approval: official Anthropic TypeScript SDK (server-only typed provider calls) and a maintained Postgres serverless driver selected for the approved database (durable SQL/transactions). Pin reviewed versions then; no agent framework, vector database or embedding SDK initially. Read installed Next route-handler/security/environment guides before any implementation.

## Decisions required

1. Source scope resolved: Career Seekers section only. Approve deploy refresh and the proposed sample-question matrix/expected answers; external/shared/homepage knowledge is excluded.
2. Identify Anthropic owner/account; approve model, daily/monthly limits, bounded eval budget and actual traffic assumptions. Key remains outside chat.
3. Identify existing database or approve a storage proposal/account/region; identify review access owner and authorized alert destination.
4. Approve the full plan, acceptance thresholds and later concrete D-007 prototype/copy. New accounts/costs and counsel-dependent releases remain explicit gates.

No Phase 6 runtime code or paid request has been made while these decisions are pending.

Storage proposal for approval: docs/recommendations/phase-06-storage-proposal.md. “Draft tests” means sample visitor questions plus reviewed expected answers/behaviors, used to catch incorrect facts, missing citations, unsafe answers and privacy failures before release. Source approval does not automatically approve the test answers or full implementation plan.
