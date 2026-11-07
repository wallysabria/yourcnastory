# Phase 5 — Analytics, consent, accessibility and performance

**Purpose:** tracking that keeps the client's history intact, California-appropriate consent
and privacy, and a full accessibility and performance pass.

---

## Prompt

This is **Phase 5: analytics, consent, accessibility and performance**. Re-read `CLAUDE.md`
§4.7, §4.8 and §5. Start in **Plan Mode** and wait for my approval.

### Inputs
- `_source/integrations/ids.md` (GA4 Measurement ID, Clarity Project ID)
- `_source/integrations/tag-audit/` (what fires on the live site today)
- `docs/audit/integrations.md`
If the IDs or tag audit are missing, stop and tell me.

### Do in this phase
1. **Tag plan first:** from the tag audit and integrations inventory, write
   `docs/integrations/tag-plan.md` — every tag, trigger and event to recreate (pageviews,
   form signups, outbound clicks, document downloads, search, chat events placeholder,
   anything the live site tracks today), and anything on the live site we're dropping (with
   reason). **I approve this before you implement.**
2. **Google Tag Manager from scratch:** I will create the new container (or tell you to use
   an existing one) and give you the ID. Deliver: the site-side GTM loader, a `dataLayer`
   event layer (typed helper, documented events), and a container configuration guide (or
   importable JSON) that reuses the **existing GA4 property and Clarity project**. Don't
   change anything in GA4, GTM or Clarity accounts yourself.
3. **Consent:**
   - Banner and preferences panel (EN + ES), equally weighted Accept / Decline, granular
     categories (necessary, analytics). Decline must be as easy as accept.
   - Google Consent Mode v2 defaults to denied; Clarity's consent API wired; nothing
     analytics-related loads before consent.
   - Honor **Global Privacy Control** automatically (treated as decline, no banner nagging).
   - Persistent "Privacy choices" link in the footer to reopen preferences.
   - Choice stored and respected across pages and languages.
   - Previews never load production analytics.
   - Propose the banner copy; it's marked for counsel review (new Spanish strings logged).
4. **Privacy policy:** draft updates for tracking technologies, consent choices, GPC/Do Not
   Track handling, Mailchimp/SMS, and chat logging (12-month retention, PII redacted). Put
   the draft in `docs/recommendations/privacy-policy-draft.md` for counsel review — **do not
   change the live privacy policy text** until approved.
5. **Accessibility audit (WCAG 2.1 AA)** across every built template, both languages:
   automated (axe) plus manual checks (keyboard, focus order, screen reader labels, color
   contrast, zoom to 200%/400%, reduced motion, form errors). Fix what's ours; log content
   issues (e.g. alt text quality) in `docs/audit/issues.md`.
6. **Performance:** Lighthouse/Core Web Vitals on mobile for every template; budgets
   documented; fix regressions (images, fonts, third-party scripts, layout shift). Report
   before/after vs. the live site.

### Not in this phase
No chatbot, no structured data/SEO work, no Employers pages.

### Acceptance criteria
- Approved tag plan implemented; events verified on a preview with GA4 DebugView / Tag
  Assistant (show evidence) **only after consent**; nothing fires on decline or with GPC.
- Consent works in both languages, persists, and can be changed from the footer.
- Zero axe violations; manual checklist completed and saved to
  `docs/reports/phase-05-a11y.md`.
- Mobile Core Web Vitals in the "good" range per template, or documented exceptions.
- Report to `docs/reports/phase-05.md`.

Stop when done and wait for me.
