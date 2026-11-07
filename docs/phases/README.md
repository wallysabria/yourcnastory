# How to run the phases

This folder holds one prompt per phase. `CLAUDE.md` (repo root) holds the standing rules and
is read automatically every session — the phase prompts assume it.

## Setup (once)

1. Copy `CLAUDE.md` to the repo root and this `docs/` folder into the repo.
2. Create a `/_source/` folder in the repo root (it will be gitignored in Phase 0) and put the
   exports in it, using these names where possible:

   | Item | Put it at | Status |
   |------|-----------|--------|
   | WordPress full content export (WXR .xml) | `_source/wordpress/export.xml` | ready |
   | Plugins page screenshot | `_source/wordpress/plugins.png` | ready |
   | Database dump (.sql) | `_source/wordpress/database.sql` | pending |
   | Uploads folder (zip or folder) | `_source/uploads/` | pending |
   | GA4 Measurement ID + Clarity Project ID | `_source/integrations/ids.md` | pending (Phase 5) |
   | Live-site tag audit (Tag Assistant notes/screenshots) | `_source/integrations/tag-audit/` | pending (Phase 5) |
   | Mailchimp audience setup (fields, merge tags, groups/tags, SMS) | `_source/integrations/mailchimp/` | pending (Phase 4) |
   | Search Console exports (pages + queries, 16 mo; indexing report) | `_source/seo/` | pending (Phase 7) |
   | Logos (SVG) + font names/licence notes | `_source/brand/` | pending (Phase 2) |
   | Chatbot knowledge sources | `_source/chatbot/` | to be defined (Phase 6) |
   | Chatbot test Q&A set | `_source/chatbot/test-set.md` | to be defined (Phase 6) |

   Never put API keys in `/_source/`. Those go into Vercel environment variables when a phase asks.

## Each phase

1. Start a fresh Claude Code session (or `/clear`) so each phase starts with clean context.
2. Paste the phase file's **Prompt** section (everything below the `---` line).
3. Claude Code plans in Plan Mode → you review → approve or redirect.
4. It builds on a `phase-XX-…` branch and opens a PR; review the Vercel preview using
   `docs/review-checklist.md`.
5. Merge only when the phase's acceptance criteria are met and you're satisfied.
6. Only then move to the next file.

Phases 8 and 9 (Employers) require your explicit approval message first — the prompt tells
Claude Code to confirm it.

If a phase reveals something that should change a later prompt, edit that prompt before you
run it.
