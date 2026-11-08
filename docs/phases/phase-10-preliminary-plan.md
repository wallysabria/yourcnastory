# Phase 10 preliminary QA plan — Career Seekers and shared pages

Status: plan prepared for approval, 2026-11-08. Owner approved preparing this limited QA pass. Implementation and fixes await approval of this concrete plan, per CLAUDE.md section 6 and phase-10-qa.md. This is an early subset of Phase 10, not full-site acceptance or launch sign-off.

## Scope and owner overrides

Baseline: published Phase 7, merge d8e2c3f995f17d27b76caa4836e7d9342df72b37 and documentation commit 7eddf7b. Freeze the actual tested SHA in each new report.

- All 48 currently renderable Career Seekers, homepage and shared pages, EN/ES; existing documents/media, 260 active redirects and shared interfaces.
- Owner clarification supersedes earlier bilingual Employer assumptions: future Employers content is English only. Its content is pending and not ready. Phase 8 stays on hold and existing Employer links stay inactive. Do not remove existing Spanish Employer manifest records or invent their redirect destinations; those URL decisions remain future work.
- Phase 6 and both chatbots remain deferred. No Employer content, Microsoft Forms, production tracking, live Mailchimp targets, DNS, domain cutover, indexing enablement or external-account changes.
- Existing frozen EN/ES copy and source styling remain authoritative. D-004 contrast/color-only-link fixes remain declined; report their failures without requesting the same decision again.

## 1. Baseline, integrity and content

Run lint, typecheck, format check, build and the existing 59-test regression suite on the branch. Preserve historical reports; parameterize reused helpers or write new phase-10-preliminary artifacts rather than overwrite prior evidence.

Crawl all built pages and extract first-party links, anchors, resource paths and status/redirect chains. Check all 260 active rules, slash variants, query preservation, existing document paths and original-upload hashes. Distinguish intentionally gated links from defects. Reuse the 332-row Search Console reconciliation as a historical inventory and verify current local dispositions without claiming that 159 deferred/unresolved rows are fixed. No new destination or URL consolidation without separate approval.

Recheck rendered body copy and source anchors against the approved archived snapshots; verify source hash provenance. Job-board sweep covers shipped content, metadata, source code and controlled documents, distinguishing historical audit/log evidence from reader-visible references. No new chatbot corpus exists to scan. Use local read-only document extraction; no PII in reports.

## 2. Appearance and behavior

Check all 48 pages at desktop and phone widths against available approved source/reference captures. Reuse stabilized visual methods with decoded images/fonts and recorded consent/motion settings. Separate source/migration visual comparison from the Phase 7 heading-only zero-pixel result; list unavailable references and dynamic differences explicitly.

Exercise header/mega/mobile menus, footer, announcement/popup behavior, locale switching and counterpart paths, FAQ, carousels, policy contents, consent and external-media Play/focus behavior. Test EN/ES search, direct query URLs, empty/no-result states and PDF discoverability where supported; document unsupported PDF indexing rather than expand scope silently. Mock signup checks cover shared instances, validation, errors and duplicate-submit/rate-limit behavior; no live lead submission.

Browser matrix: full existing Chromium suite; targeted journeys in available Firefox, Playwright WebKit and installed Edge. Report exact engines/versions and availability. Playwright WebKit is not actual Safari/iOS; viewport emulation is not a physical Android/iOS test. Native Safari/iOS/Android and OS screen-reader coverage remain pending where unavailable. No paid device/browser service or new dependency proposed; use existing Playwright tooling.

## 3. Accessibility and performance

Refresh all 48 routes at phone/desktop widths with fresh/saved-decline privacy states (192 route/viewport/choice states). Separate known D-004 results from new violations. Check keyboard order, skip link, modal focus/Escape/return, field names/errors, landmark/heading structure, reduced motion and 320 CSS-pixel reflow. Inspect accessible names and meaningful-image alt findings without rewriting frozen text. Record native screen-reader/actual browser-zoom limitations; no WCAG conformance claim from axe alone.

Re-measure the nine existing template representatives in both languages (18 routes), three cold mobile lab runs each, on the public review alias while it still serves this baseline, or the branch preview if implementation changes. Record LCP, CLS, TBT, score and encoded JS size and compare Phase 5 medians/settings. Separate environment/consent effects and known failures. Only repeat targeted measurements after a justified fix. Field p75 CWV/INP and live-vendor overhead remain unavailable; do not equate lab TBT with INP or promise good field CWV.

## 4. SEO, privacy and security

Verify metadata, canonicals, reciprocal EN/ES hreflang, source robots overrides, sitemap index and eligible entries, modification provenance, structured-data visibility/safe serialization, search-query noindex and stage robots. Reuse isolated launch-mode tooling with tracking forced off and staging restored in finally, only if new findings/code changes warrant it. No remote launch gate changes.

Check current optional SDKs remain blocked, retained vendors are represented only by approved mocks, consent acceptance/decline/category separation/GPC/DNT/withdrawal/storage failure work, and event payloads exclude form/query values. Use bounded mock tests. Review secret-handling, client/server separation, review-endpoint access, existing headers and CSP compatibility. Redact secret findings; no credential values or customer data in output. Any new CSP/header enforcement is a concrete proposal for approval, not automatic publication.

## 5. Defects, decisions and handoff

Fix reproducible implementation defects within the existing approved behavior only. Read the relevant installed Next documentation before any framework code change. Do not rewrite copy, alter source visuals, choose redirects, enable integrations or broaden scope under the label of QA. Record proposals where needed, then continue independent checks. Rerun focused tests after fixes plus required final checks; no unnecessary repeated whole-site scans.

Deliver:
- docs/reports/phase-10-preliminary.md: tested SHA/origins, commands, coverage matrix, pass/fail/deferred results, screenshots where useful, prioritized defects, fixes and limitations.
- Machine-readable link/anchor, cross-browser, accessibility, visual and performance evidence under uniquely named phase-10-preliminary paths. Raw source captures stay ignored.
- docs/reports/phase-10-launch-blockers.md: consolidated URL/document dispositions, source noindex choices, accessibility/performance findings, missing native-device/screen-reader checks, Mailchimp/vendor configuration, counsel/native-language review, Employer and chatbot dependencies.
- Clean Spanish review handoff from existing log, with exact wording/context and no replacement translations. Counsel status remains pending until provided; agent cannot certify legal approval.
- Update all four logs and record the English-only Employer decision as a scoped override without changing Employer routing/content.
- Review PR and Vercel preview if fixes or QA tooling are committed; no merge/publish without owner instruction.

## Acceptance for this limited pass

Every in-scope check has evidence and a result: pass, fail, retained owner decision, deferred dependency or unavailable environment. New clearly fixable defects are addressed within scope; unresolved matters have concrete recommendations. Known failures are not converted to passes. Full Phase 10 go/no-go remains deferred until Employer content/build, chatbot scope and all launch-critical gates are resolved. Phase 11 does not begin.
