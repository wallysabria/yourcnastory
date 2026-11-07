# Phase 6 — Career Seekers chatbot

**Purpose:** replace the MxChat plugin with a bilingual assistant grounded in a clean,
consolidated knowledge base, built on an engine that the Employers bot will reuse.

> Before running this phase, decide (or tell Claude Code to stop and ask about):
> knowledge-base sources and refresh schedule; Anthropic account and model; the test Q&A set.

---

## Prompt

This is **Phase 6: Career Seekers chatbot**. Re-read `CLAUDE.md` §4.8 and §5. Start in
**Plan Mode**. The plan must cover architecture, data flow, safeguards, logging and cost
controls. Wait for my approval.

### Inputs
- `_source/chatbot/` — knowledge sources (site content, external websites, data files) and
  `test-set.md`. If sources or the test set are undefined, stop and ask; you may propose a
  draft test set from site content for my approval.
- Anthropic API key in environment variables (I'll add it when you ask). Model choice is a
  decision gate — propose one with reasoning (quality, latency, cost at our traffic) and
  wait for my answer.

### Requirements
**Engine (shared):** one chat engine with per-bot configuration: system prompt, knowledge
set, scope rules, which pages it appears on, UI strings. Adding the Employers bot in Phase 9
must be configuration, not a rebuild.

**Knowledge base:**
- Built from scratch (do not port MxChat's setup). Sources: in-scope site content (EN + ES,
  including searchable PDFs), plus approved external pages and data files.
- External sources are summarized and linked, not reproduced wholesale; each chunk keeps its
  source URL.
- Rebuilt automatically from site content at deploy; external sources refreshed per the
  schedule I decide. Job-board content excluded.
- Retrieval returns cited sources; answers link to the specific page used (in the
  visitor's language when an equivalent exists).

**Behavior (Career Seekers bot):**
- Write the system prompt fresh, using the old MxChat prompt only as a reference for
  scope and tone, and fixing its problems (contradictory length rules, unfilled
  placeholder, hardcoded facts, duplicate fallbacks, English-only scripted replies).
- Scope: CNA careers in long-term care in California — becoming a CNA, training paths,
  Earn and Learn, costs and timelines, skills, the state exam, career advancement, CUSP,
  finding training providers. Facts come **only** from the knowledge base — no figures
  hardcoded in the prompt.
- Out of scope: Employers program details → warm redirect (to employer pages once enabled;
  until then, to info@yourcnastory.org).
- Replies: short by default; fuller when the question warrants; **never more than two
  paragraphs**. Responds in the visitor's language. Links to pages, never invents URLs,
  facts, names or numbers.
- Single fallback when the answer isn't in the knowledge base: say so plainly and give the
  next step (contact info@yourcnastory.org).
- Guardrails: no medical, legal or individual eligibility determinations; doesn't ask for
  personal information; resists attempts to override its instructions or change its role;
  appropriate response to someone in distress (point to emergency/crisis resources).

**In-chat signup:** when a visitor wants updates, show the Phase 4 Mailchimp component
inside the chat (same fields and SMS consent text). Submission goes straight to the
Mailchimp route; **the chat log records only that a signup happened, never the details.**

**Safeguards:** per-visitor and per-session rate limits; message length and conversation
length caps; bot protection on the chat endpoint; server-side only API calls; no tools or
actions beyond retrieval and the signup handoff; a daily/monthly spend ceiling enforced in
code plus a recommendation for the Anthropic Console limit; alerting on usage spikes;
graceful "temporarily unavailable" state.

**Logging:**
- Every session logged (timestamp, language, page, messages, sources cited, fallback hit,
  signup event, latency, token usage).
- **PII redaction before storage**: emails, phone numbers, ZIP codes, street addresses;
  best-effort names. Test redaction explicitly.
- 12-month retention, enforced automatically.
- Password-protected **internal review page** (session browser, search, filters, CSV
  export) and a **summary report** view (sessions, top questions, unanswered questions,
  signups, language split) for client topline reporting.
- Propose the storage service; it's a decision gate if it needs a new account or cost.

**UI:** matches the site's look; accessible (keyboard, screen reader, focus management,
reduced motion); lazy-loaded so it doesn't affect page performance; EN + ES interface
strings (new Spanish logged); disclosure that chats are logged, linking to the privacy
policy; chat events sent to the Phase 5 dataLayer (consent-aware).

### Evaluation
- Automated eval suite from the approved test set, run in both languages: correctness vs.
  expected answers, citations present and valid, length limit, language match, scope
  handling, fallback behavior, prompt-injection and misuse attempts, redaction.
- Report pass rates; the bot doesn't ship to preview for client testing until I approve the
  results.

### Not in this phase
No Employers bot. No SEO work.

### Acceptance criteria
- Eval suite passes at the threshold we agree in the plan; failures explained.
- Redaction tests pass; logs contain no test PII.
- Rate limits, caps and spend ceiling demonstrated.
- Review page and summary report working and password-protected.
- Report to `docs/reports/phase-06.md`, including the final system prompt and estimated
  monthly cost at current traffic.

Stop when done and wait for me.
