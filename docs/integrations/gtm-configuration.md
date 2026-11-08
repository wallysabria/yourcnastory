# GTM owner configuration guide — Phase 5

Approved 2026-11-08. Site-side implementation uses mocks; **do not publish or enable live tags from this guide yet**. The agent has not changed any GA4, GTM, Clarity, advertising account or container workspace. Existing WordPress tracking remains untouched. Owner selected reuse of GTM-TLC2T6FQ and explicitly retained all advertising destinations.

## Destinations to preserve

| System | Confirmed identifiers | Status |
|---|---|---|
| GA4 | Property 407144160; G-RC2WSP3DYG | Retained; live verification deferred |
| Clarity | yr1ps67xpa | Retained; live verification deferred |
| GTM | GTM-TLC2T6FQ | Reuse existing container; export required |
| Google Ads | AW-11464482635; AW-18269807080 | Preserve exact owner-exported labels and triggers |
| Floodlight | DC-14019833; DC-14063874 | Preserve exact activity/group/type/counting mappings |
| MNTN | dx.mountain.com; gs.mountain.com; px.mountain.com observed | Preserve exact owner-exported advertiser IDs/pixels/rules |

GT-NB3VX8H and linked destinations were also observed. The screenshot/public audit cannot establish the complete container, consent checks, conversion semantics, linked Google tag behavior or campaign identifiers. Obtain an owner export and reconcile every existing tag/trigger/variable and destination before implementing real mappings. Do not invent Ads conversion labels, Floodlight activities or MNTN payloads. A page-visit conversion observed on Career Seekers must not be silently reclassified as a signup. Never drop these tags merely to meet a performance budget.

## Current fail-closed gates

`lib/tracking-config.ts` resolves the nonsecret server configuration. Default mode is mock. `TRACKING_MODE=production` additionally requires VERCEL_ENV=production, the existing launch gate, GTM_CONFIGURATION_VERIFIED=true and TRACKING_LIVE_APPROVED=true. The browser additionally requires HTTPS and an exact approved production hostname. Every other requested live configuration resolves to off. Current migration alias and previews must continue with mocks/off, including after merging this phase. `.env.example` contains names only. No secret belongs in NEXT_PUBLIC variables or committed files.

No external SDK loads in mock mode, including after Accept. Mock event eligibility for Google Ads/Floodlight/MNTN proves consent routing only; it does not simulate a conversion or establish vendor delivery. `window.__ycnaMockEvents` is bounded to 100 records, stays in memory and can be observed through the `ycna:tracking` DOM event.

## Owner workspace preparation before a later live approval

1. Export and archive the current published container and linked Google tag settings. Work in an unpublished owner-controlled workspace. Preserve WordPress behavior until cutover; use an explicit site_platform condition if necessary. Do not publish migration-only rules into the live WordPress site accidentally.
2. Reconcile the approved tag plan against the export. GA4 and Clarity require analytics consent; Ads, Floodlight and MNTN require advertising consent. Tags with mixed purposes require every relevant category. Necessary features do not include optional vendor tracking.
3. The site queues Google consent defaults (analytics_storage, ad_storage, ad_user_data and ad_personalization denied) before any container request. It updates analytics and ad fields independently. The loader starts only after at least one optional grant; **that is insufficient by itself**: per-tag checks must block advertising on analytics-only grants and analytics on advertising-only grants. Never use advanced denied pings where the approved requirement is no pre-consent optional requests.
4. Inspect built-in consent checks AND add explicit category conditions for every tag. Custom HTML/MNTN may ignore Google's built-in checks. Review All Pages, Initialization/Consent Initialization, linked Google tags/destinations, automatic collection and scripts that load additional tags. Confirm Clarity is only created by the approved analytics trigger; wire the documented consentv2 command with analytics_Storage/ad_Storage. Disable duplicate Clarity loaders and GA4 automatic pageviews/history collection when using the explicit site events.
5. Map the typed event contract below. Configure GA4 send_page_view=false and send the explicit page_view once. Disable duplicate enhanced-measurement history, outbound, search, download and scroll rules where the site emits them. Override page_location/page_referrer with sanitized event values; do not let raw query strings, search terms, form data or arbitrary dataLayer values enter vendor payloads. Separately verify vendor own collection, Clarity masking and session replay restrictions on forms.
6. Retain existing Ads/Floodlight/MNTN mapping semantics, adding category checks rather than assuming every GA4 event is an ad conversion. Import no speculative conversions. Preserve the established Google tag links only after verifying each destination's category gating.
7. A consent update cannot recall previously sent data. The site stops events immediately on withdrawal, clears known first-party optional-cookie names where accessible and reloads if a live container was loaded. Review vendor-specific deletion/withdrawal requirements separately; third-party cookies and remote records cannot be deleted by this local helper.
8. Owner supplies the reconciled configuration and requests a separate live-validation/activation step. The present owner decision is mocks and deferred live verification. Do not use production IDs for ordinary preview testing. No account publication, production tracking activation or DNS change is authorized by Phase 5 implementation.

## Typed event contract

All events require analytics consent and an approved non-Employer route. Common parameters: page_path, language, template. Query strings/fragments are excluded. Advertising-only grants create vendor eligibility mocks, not GA4 events.

| Event | Trigger | Additional payload |
|---|---|---|
| page_view | First permitted view; actual route changes; regrant | page_title, sanitized page_location, referrer origin only |
| generate_lead | Existing signup_submitted with mode=live and outcome=created | form_key=career-signup; suppressed for mock/duplicate/invalid response |
| outbound_click | Click/middle-click on audited external host | positional link_key and destination_host; no full URL/anchor text |
| file_download | Click on an audited document mapping | document_key, file_extension; no signed URL/query |
| site_search | Submit a completed nonblank search, or choose its result | query_length, result_count; no search text |
| search_result_click | Select approved same-language result | result_path, result_position |
| scroll | Once per route after 90% scroll | percent_scrolled=90 |

Reserved only: chat_open, chat_message_sent, chat_signup_success. No chatbot or chat transmission exists in this phase. DataLayer events are site facts, not proof of business conversions. The generic type does not authorize custom dimensions containing personal information.

## Deferred live acceptance matrix

Before any later activation, owner verifies fresh no-choice, decline, analytics-only, ad-only, both grants, withdrawal, expiry, cross-tab, GPC, DNT, EN/ES navigation, duplicate pageviews and mock signup suppression. Capture sanitized network evidence plus GA4 DebugView/Tag Assistant, Clarity evidence and owner-confirmed advertising delivery against the exact exported rules. Inspect all provider iframes separately. No such live evidence is claimed in Phase 5; no live lead forms were submitted.

Primary references: [Google consent](https://developers.google.com/tag-platform/security/concepts/consent-mode), [Clarity ConsentV2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).
