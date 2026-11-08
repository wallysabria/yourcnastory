<!-- Owner approved the revised Phase 5/tag plan in chat on 2026-11-08. Implementation uses mocks; live verification deferred. -->
# Approved tag plan — Phase 5

Status: revised plan approved explicitly by the owner in chat on 2026-11-08. Based on docs/audit/phase-05-tag-audit.md and the existing integrations inventory. This document does not configure any account or enable tracking.

## Destinations and account ownership

Owner-confirmed on 2026-11-08: GA4 Property 407144160, Measurement G-RC2WSP3DYG; Clarity project yr1ps67xpa. Preserve these production destinations/history. Owner selected the existing GTM-TLC2T6FQ for reuse and explicitly instructed retaining Google Ads, Floodlight and MNTN. Prepare an owner-reviewed configuration guide for this container; do not create, edit or publish account/workspace changes ourselves. It also serves the live WordPress site, so owner publication/cutover must preserve existing campaigns.

Before live configuration, owner reviews connected Google tag destinations, enhanced measurement and existing key-event settings. GT-NB3VX8H currently connects with advertising traffic in the public sample. Linked destinations must respect advertising consent independently of analytics consent. Test for unexpected or premature destination requests before any live activation. A read-only container export/account review is needed for exhaustive old-trigger reconciliation.

## Retained services — owner decision, 2026-11-08

| Observed service                            | Decision                                    | Consent / preservation requirement                                                                                 |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| GA4 G-RC2WSP3DYG / Property 407144160       | Retain                                      | Analytics grant; existing history; no duplicate pageviews                                                          |
| Clarity yr1ps67xpa                          | Retain                                      | Analytics grant; advertising storage follows the separate advertising choice; no custom user identification        |
| GTM-TLC2T6FQ                                | Reuse existing container                    | Owner-controlled workspace review/publication; no blind overwrite                                                  |
| Google tag GT-NB3VX8H                       | Preserve verified destination relationships | Reconcile linked destinations and avoid duplicate loaders; advertising connections require advertising grant       |
| Ads AW-11464482635                          | Retain                                      | Preserve verified labels/triggers; advertising grant; no invented signup mapping                                   |
| Ads AW-18269807080                          | Retain                                      | Same; observed page-visit conversions may be intentional                                                           |
| Floodlight DC-14019833                      | Retain                                      | Preserve activity type/category, counting method, variables and triggers; advertising grant                        |
| Floodlight DC-14063874                      | Retain                                      | Same; owner export needed for exact configuration                                                                  |
| Mountain/MNTN dx/gs/px.mountain.com         | Retain                                      | Preserve advertiser/pixel keys and verified triggers; advertising grant; custom HTML needs explicit consent guards |
| Existing campaign custom HTML / other rules | Reconcile, not silently remove              | Owner export needed to establish purpose, identifiers and trigger behavior                                         |
| Mailchimp embed / retired MxChat runtime    | Continue native form / later chatbot plan   | No restoration of obsolete UI scripts; mock signup is not a conversion                                             |

The prior advertising-omission proposal was rejected and is superseded. No advertising configuration has been removed from any account or source site. Browser-observed IDs alone do not establish full conversion mappings. Obtain an owner-provided container export/configuration before real integration; preserve deliberate page-visit conversions rather than reclassifying them as signup success.

### Existing-container safety gate

Loading the existing container after analytics-only consent could still run its current All Pages advertising/custom HTML tags. Local event filtering and Consent Mode defaults alone cannot guarantee safety. Before live use, owner-reviewed per-tag consent checks and triggers must enforce analytics versus advertising choices, including conversion linker, connected Google destinations, Floodlight and MNTN custom HTML. Avoid changing WordPress tracking prematurely; use an unpublished owner-managed workspace and an explicit migration/cutover plan. Do not publish a replacement over the live container blindly. Until that configuration is verified and live activation separately approved, the rebuild uses mocks and does not request the production container.

## Event and trigger contract — proposed

All optional delivery requires the corresponding analytics or advertising grant, no GPC/decline, an allowed environment and approved destination IDs. Before grant, no event backlog is retained for later replay. No names, email, phone, ZIP, user IDs, raw search/chat text, form values or full query strings enter analytics.

| Site hook / GA4 event                               | Exact trigger                                                                                                                          | Safe parameters / limits                                                                                                                                                                               |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| page_view                                           | Once for the current route when analytics first becomes eligible; once per subsequent completed route change                           | Approved pathname, locale, template, controlled page title; clean page_location/referrer without query/hash. Disable duplicate automatic pageviews; owner checks enhanced-measurement history settings |
| signup_submitted -> generate_lead                   | Only a future verified real new signup acceptance; never button click, form start, invalid/error, existing subscriber or mock response | Form key, locale, method; no personal fields. Currently suppressed because Mailchimp is mock. Exact real-success contract waits for audience integration                                               |
| outbound_click                                      | User activates an external content link                                                                                                | Allowlisted link key and destination host; no full query, fragment or arbitrary link text. Exclude gated employer controls                                                                             |
| file_download                                       | User activates a document link identified by the audited manifest (including approved external document links)                         | Document key, extension, locale; no arbitrary URL query. One event rather than an additional generic outbound event for the same document click                                                        |
| site_search                                         | One completed search interaction, deduplicated locally; no per-keystroke event stream                                                  | Query length and result count, locale; no raw search term or hash of the query                                                                                                                         |
| search_result_click                                 | User chooses an internal search result                                                                                                 | Selected approved pathname and result position; no search text                                                                                                                                         |
| scroll                                              | Once per page after 90% scroll, only after analytics eligibility                                                                       | Percent, approved pathname/locale. Source gtm.scrollDepth is observed; GA4 scroll delivery was not confirmed. Proposed explicit replacement, not a claimed historical name                             |
| consent_changed                                     | Local technical consent transition only                                                                                                | Necessary to gate loaders and preferences; not sent as an analytics event on decline/GPC                                                                                                               |
| chat_open / chat_message_sent / chat_signup_success | Reserved types/documentation only                                                                                                      | No chat implementation or transmissions in Phase 5; future phase must approve payloads; no message text                                                                                                |

The public audit observed page_view, advertising conversion/gtag.config requests, and dataLayer gtm.js/dom/load/scrollDepth. It did not verify historical signup, outbound, download, search or chat success events. The proposed business events above are explicit replacement contracts; exact historical custom-event parity requires an owner export. Owner decides any key-event designation; the agent makes no account-side changes.

## Retained advertising trigger reconciliation

Use existing advertiser IDs, conversion labels and Floodlight/MNTN activity/pixel mappings from the owner export. Preserve verified page-visit and conversion triggers; do not replace all advertising rules with the new GA4 event taxonomy. Real form-success advertising events require a verified real outcome and approved mapping; mock, invalid and existing-subscriber results must not become new-lead conversions. Account-side key-event/campaign changes remain owner actions.

## Consent and loader behavior

Use a small native consent store/UI, with necessary, analytics and advertising categories, equally weighted Accept/Decline, EN/ES labels, persistent Privacy choices, same-origin persistence across paths/languages, and a versioned expiry policy (proposed 180 days, counsel review). Invalid/missing/expired choices default to denied.

Use basic blocking: queue denied Google Consent Mode v2 defaults locally, with no optional SDKs before a valid category grant. After verified container configuration, GTM may load for either optional category, but GA4/Clarity require analytics consent and Ads/Floodlight/MNTN require advertising consent. Analytics-only grant leaves ad_storage, ad_user_data and ad_personalization denied; advertising grant controls those fields independently. Clarity loads only for analytics grant and uses consentv2 with analytics_Storage and ad_Storage reflecting their respective choices. SDK consent mode alone is insufficient to meet the requested no-request-before-consent policy: Google advanced mode and Clarity no-consent mode can still make requests. [Google consent modes](https://developers.google.com/tag-platform/security/concepts/consent-mode), [Clarity ConsentV2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).

GPC takes precedence over any stored grant: treat it as decline of both optional categories, do not nag with the banner, and explain the browser-controlled state in preferences. Proposed DNT handling is also decline. This is the project's requested behavior; counsel determines policy wording/applicability. [California AG GPC guidance](https://oag.ca.gov/privacy/ccpa/gpc).

On withdrawal, synchronously stop dispatch, communicate denial to already-loaded SDKs, clear applicable first-party analytics cookies and reload into the blocked state so loaded SDKs cannot keep collecting. Previously sent/queued network traffic cannot be retracted. Test fresh/stored decline and GPC for zero analytics/advertising requests, and withdrawal for cessation after the blocked reload; document any SDK termination/consent signaling.

## Environment and test-target decision

Ordinary previews and the current migration review alias remain analytics-off/mock. Production delivery additionally requires explicit launch approval and an approved real-domain allowlist; Vercel production environment alone is insufficient. No production analytics should load at yourcnastory.vercel.app during this migration.

Owner chose mocks and deferred live verification. No separate test destination IDs are required for this approved testing approach now. Do not use production GA4, Clarity, GTM, Ads, Floodlight or MNTN destinations for preview tests. Mock transports will exercise every consent combination and record only sanitized event fixtures.

Live DebugView/Tag Assistant, advertising conversion and Clarity validation remain explicit deferred acceptance evidence, not claimed passes. They require a later owner-approved testing/cutover arrangement and verified container mappings. Existing-container ID selection and advertising retention are resolved; overall revised plan approval remains pending.

## Verification and deliverables after approval

- Typed event helper and event tests; server/client boundaries and installed Next.js docs checked before code changes.
- Native consent/banner/preferences, footer link, persistence and GPC/DNT tests in both languages; all proposed new Spanish UI strings logged.
- Network/storage matrix: fresh, accept, decline, stored choice, GPC overriding grant, withdrawal, language navigation, invalid/expired choice, missing config, ordinary preview and mocked destination modes, including analytics-only, advertising-only and both.
- Owner applies container configuration guide/importable config; no agent account changes. Owner confirms stream settings to avoid duplicate automatic measurement.
- Live DebugView/Tag Assistant, Clarity and campaign validation deferred by owner. Verify mock network/event contracts now; do not claim actual third-party delivery or campaign continuity is proven by mocks.
- Production IDs remain disabled until release authorization. No live privacy policy replacement without counsel/owner approval.
