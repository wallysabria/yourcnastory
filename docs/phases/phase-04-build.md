# Phase 4 — Templates, pages, Mailchimp form and search

**Purpose:** render the Career Seekers section, homepage and shared pages so they look and
behave like the live site, with the rebuilt signup form and site-wide search.

---

## Prompt

This is **Phase 4: templates, pages, form and search**. Re-read `CLAUDE.md`,
`docs/reports/phase-03.md` and `docs/audit/design-reference.md`. Start in **Plan Mode** and
wait for my approval. In your plan, list every template and the URLs that use it.

### Inputs
- Phase 3 content
- `_source/integrations/mailchimp/` (audience setup). If missing, build the form against a
  mock and stop before connecting to Mailchimp.

### Do in this phase
1. **Templates and components** for every in-scope page type (homepage, section landing,
   standard content page, career path index and entry, resources pages with anchored
   sections, FAQ page). Match layout, spacing, typography, imagery and interactions
   (accordions, tabs, carousels, video) on desktop and mobile.
   - Any deliberate deviation → log as **proposed** in `design-changes-log.md`; don't ship
     it until approved. Already approved: pinch-zoom fix; Mailchimp form overflow fix.
   - Homepage employer blocks render as today; their links stay inactive (flag).
2. **Popups:** reproduce each in-scope Elementor popup's behavior as documented in Phase 1,
   or propose an alternative with a stated benefit.
3. **Mailchimp signup — one reusable component** used everywhere the form appears:
   - Fields: First Name*, Last Name*, ZIP Code*, Email*, SMS Phone (optional, with country
     code), Language Preference* (English, Español). SMS consent disclosure **verbatim**
     from the live form, in each language as it exists today.
   - Posts to a server route that calls the Mailchimp API (key from environment
     variables). Map fields, merge tags, tags and groups exactly to the existing audience
     setup; document the mapping in `docs/integrations/mailchimp.md`.
   - Client and server validation, accessible errors (EN + ES interface strings, new
     Spanish strings logged), spam protection (honeypot + rate limit; propose more if
     needed), success/failure states, double-submit protection.
   - Existing subscriber, invalid email and API-down cases handled gracefully.
   - Emits a `signup_submitted` event hook for Phase 5 analytics (no analytics yet).
   - **Testing:** mocks in automated tests. Live testing only against a test audience or a
     dedicated test tag I approve — never pollute the real audience.
4. **Site-wide search:** build the search UI and index (per the Phase 2 spike). Results
   scoped to the current language; PDFs included if the spike confirmed it's
   straightforward. Accessible (keyboard, screen readers), fast, with a no-results state.
   Employers pages are excluded from the index while the flag is off.
5. **Visual parity checks:** automated screenshot comparison of every in-scope URL against
   the Phase 1 reference screenshots (desktop + mobile, EN + ES). Report differences above
   a threshold with images.

### Not in this phase
No analytics or consent banner, no chatbot, no SEO structured data, no Employers pages.

### Acceptance criteria
- Every in-scope URL renders on the preview, passes Phase 3 parity, and passes visual
  comparison or has an explained/approved difference.
- Form works end-to-end against the approved test target; mapping documented.
- Search works in both languages and stays in-language.
- No axe violations on any template; keyboard navigation works for menus, popups, form and
  search.
- Report to `docs/reports/phase-04.md` with preview links per template.

Stop when done and wait for me.
