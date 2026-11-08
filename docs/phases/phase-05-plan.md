# Phase 5 plan — proposed for approval

## Starting point

Phase 4 PR #5 was approved for merge in chat and merged as 01b1dc2758aa3a606a9c992023a793a15f4658f7 on 2026-11-08. The public Vercel alias was verified for 48 pages, bilingual search and reduced-motion grids. It remains noindex with analytics off and mock Mailchimp. The 96 visual flags remain review items; the merge is not a claim of pixel parity. D-004 source contrast/link styling remains declined and must not be silently changed.

Owner confirmed GA4 Property 407144160, Measurement G-RC2WSP3DYG and Clarity yr1ps67xpa. The owner authorized creation of the missing read-only public tag audit. That input work is complete; this plan does not authorize implementation until approved. Branch: phase-05-integrations.

## Work sequence

1. Approve docs/integrations/tag-plan.md: keep the confirmed GA4/Clarity destinations; clean owner-created GTM container; proposed omission of Ads, Floodlight and MNTN; explicit event contracts and no personal-data payloads. Capture owner configuration/export where public evidence cannot establish existing triggers.
2. Implement disabled-by-default typed event and loader infrastructure, with no runtime dependency beyond the existing stack. Prevent production analytics in previews and the current migration review alias. Obtain the clean GTM ID and resolve the QA target before live tag verification.
3. Build native EN/ES consent banner and preferences, equal Accept/Decline, necessary/analytics categories, footer Privacy choices, versioned persistence, GPC precedence and proposed DNT decline. Use basic tag blocking plus Consent Mode v2 / Clarity ConsentV2. Proposed banner design/copy is in docs/recommendations/phase-05-consent-copy.md and requires approval/counsel review.
4. Draft privacy-policy changes in docs/recommendations/privacy-policy-draft.md for counsel: tracking, consent/GPC/DNT, actual Mailchimp/SMS state and future redacted chat logging/12-month retention. Do not replace the frozen live EN/ES policy or claim unimplemented services are already operating.
5. Audit accessibility across all 48 built URLs in both languages/desktop/mobile, plus manual keyboard, focus, labels, errors, 200%/400% zoom/reflow and reduced-motion checks on all nine templates. Fix native defects that preserve appearance/copy; log content/alt issues in docs/audit/issues.md. Respect D-004; zero-axe acceptance remains unmet while its failures are retained. Any further visual changes become separate concrete proposals.
6. Measure mobile performance for all nine templates in EN/ES (18 representative routes), three cold runs per route, comparable live-source and native conditions, plus accepted-analytics QA overhead. Use Lighthouse and interaction checks, document raw reports/medians and budgets, then optimize assets/fonts/script/layout without changing design, copy or URLs. Recheck visual comparisons for affected templates.
7. Run lint/typecheck/format/build, content parity, consent/event/network tests, axe/manual checks and performance verification. Update all four logs, save phase-05.md and phase-05-a11y.md, commit logical units and open a Phase 5 PR/preview. No merge, launch or next phase without owner approval.

## Performance targets and measurement limits

Target LCP <=2.5 seconds and CLS <=0.1 in mobile lab runs; target real-user INP <=200 ms at the 75th percentile when field data exists. Lighthouse does not measure field INP; use lab TBT <=200 ms as a regression budget plus representative interaction measurements, and label unavailable field evidence explicitly. [Official Web Vitals guidance](https://web.dev/articles/vitals).

Proposed initial budgets: Lighthouse mobile performance >=90 median per representative route, initial first-party JavaScript <=200 KiB compressed and no unnecessary third-party requests before consent. Measure existing HTML/CSS/font/media costs first; record exceptions and tighten route-specific budgets after baseline rather than silently changing design to meet a score. Retain original assets/upload paths; generate derivatives only where source-matching responsive delivery benefits performance. Full-site field CWV cannot be certified from a fresh staging deployment or a single lab run.

Only proposed new package: Lighthouse, development/audit-only, pinned when approved, for reproducible mobile reports. Existing Playwright/axe and Next image tooling cover interaction/accessibility/media checks. No new runtime consent/CMP library, paid service or account created by the agent.

## Approval and owner-input gates

- Approval of this plan and the tag plan, including the proposed advertising omissions and event taxonomy.
- Owner-provided clean GTM container ID; agent will not create or modify analytics accounts.
- Isolated QA GA4/Clarity destinations for live DebugView/Tag Assistant evidence, or explicit deferral of that evidence while mocks are used. Production IDs stay blocked in ordinary previews.
- Counsel/owner approval of consent wording before release and policy wording before changing live policy. New Spanish interface copy is logged; existing Spanish remains frozen.
- Source accessibility styling decision D-004 remains in force. This plan does not reopen it or claim zero violations; report the acceptance exception candidly.

No chatbot, structured data/SEO, Employers pages, live Mailchimp connection, DNS change or production tracking activation in this planning step.
