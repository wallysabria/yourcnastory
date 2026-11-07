# Phase 0 — Orientation and environment

**Purpose:** confirm Claude Code understands the project, the repo and Vercel are wired up,
and the working structure exists. No site code yet.

---

## Prompt

We're starting the YourCNAStory.org migration. This is **Phase 0: orientation and
environment**. Read `CLAUDE.md` in full first, then `docs/phases/README.md`.

Start in **Plan Mode**. Do not change anything until I approve your plan.

### Do in this phase
1. **Confirm understanding.** In your own words, summarize back to me (briefly): the goal,
   the non-negotiables in `CLAUDE.md` §4, the Employers gate, the Spanish freeze, and the
   phase roadmap. Flag anything in `CLAUDE.md` that is ambiguous or that you think is
   wrong or risky.
2. **Check access** (read-only checks; report results):
   - GitHub: can you read and push to `wallysabria/yourcnastory`? What's on `main` now?
   - Vercel: is the CLI available and authenticated? Is a project linked to this repo yet?
     Do not create or change a Vercel project yet — report what exists and propose the
     setup for my approval.
   - Local tooling: Node.js and package manager versions.
3. **Inventory `/_source/`.** List what's there against the table in
   `docs/phases/README.md`. For anything missing, say which phase needs it. Do not open the
   database dump beyond confirming it exists and its size.
4. **Read the plugins screenshot** (`_source/wordpress/plugins.png`) and list every active
   plugin with a one-line note on what it does for the site and which phase it affects.
   Confirm (or correct) our assumptions: translation plugin, SEO plugin, MxChat, Elementor
   popups, any form or redirect plugins.
5. **After I approve the plan**, set up the working structure on branch
   `phase-00-orientation`:
   - `.gitignore` including `/_source/`, `.env*` (except `.env.example`), build output,
     OS/editor files. **Verify** `/_source/` is ignored (`git check-ignore`) before any commit.
   - `CLAUDE.md` at the root (as provided — do not edit it; propose edits in your report).
   - `docs/phases/` (as provided), `docs/reports/`, `docs/audit/`,
     `docs/recommendations/`.
   - `docs/logs/` with empty, headed templates: `spanish-review-log.md`,
     `content-changes-log.md`, `design-changes-log.md` (columns: ID, page, change, benefit,
     status = proposed/approved/rejected), `decisions-needed.md` (pre-filled with the
     deferred decisions listed in `CLAUDE.md` §7).
   - `README.md`: one paragraph on what the project is and where the docs live.
   - Open a PR to `main`.

### Not in this phase
No Next.js app, no dependencies, no crawling, no content work, no Vercel project changes.

### Acceptance criteria
- Summary of understanding delivered, with any concerns about `CLAUDE.md`.
- Access check results for GitHub, Vercel and tooling.
- `/_source/` inventory with missing items mapped to phases.
- Plugin list with notes.
- PR open; `git ls-files` shows nothing from `/_source/`.
- Report saved to `docs/reports/phase-00.md`.

Stop when done and wait for me.
