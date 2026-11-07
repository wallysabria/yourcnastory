# YourCNAStory.org

Migration of [yourcnastory.org](https://yourcnastory.org) — the Certified Nurse Assistant
Program (CNAP) run by Quality Care Health Foundation — from WordPress/Elementor to a
statically generated Next.js site on Vercel, keeping the same look, every URL, and the
English/Spanish content, with stronger SEO and AEO. Standing rules are in
[`CLAUDE.md`](CLAUDE.md); phase prompts are in [`docs/phases/`](docs/phases/), phase reports
in [`docs/reports/`](docs/reports/), working logs in [`docs/logs/`](docs/logs/), and the
review checklist in [`docs/review-checklist.md`](docs/review-checklist.md). Raw exports live
in a local, gitignored `/_source/` folder and are never committed.

## Foundation development

Use Node.js 24 and `npm ci`. Run `npm run dev` (localhost:3101), `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run build`, and `npx playwright test`. `npm run search:spike` runs the isolated bilingual Pagefind experiment after a build. See docs/reports/phase-02.md for scope and evidence. No page bodies or Employers pages are published by this foundation.

## Content extraction

See docs/reports/phase-03.md. Run `npm run content:capture`, `npm run content:extract`, `npm run content:media`, `npm run format`, and `npm run content:verify:live` to refresh/verify approved sources. Raw HTML stays in ignored `_source/phase-03/`. `npm run content:verify` is the offline CI gate. `/api/content-review/?path=/es/` renders inert extracted copy; finished templates remain Phase 4 work.
