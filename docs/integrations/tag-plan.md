# Proposed tag plan — Phase 5

Status: proposed; owner approval required before implementation. Based on docs/audit/phase-05-tag-audit.md and the existing integrations inventory. This document does not configure any account or enable tracking.

## Destinations and account ownership

Owner-confirmed on 2026-11-08: GA4 Property 407144160, Measurement G-RC2WSP3DYG; Clarity project yr1ps67xpa. Preserve these production destinations/history. Owner supplies a new GTM web container ID; legacy GTM-TLC2T6FQ is reference only. Do not publish into the legacy container or change GA4/GTM/Clarity accounts ourselves.

Before live configuration, owner reviews connected Google tag destinations, enhanced measurement and existing key-event settings. GT-NB3VX8H currently connects with advertising traffic in the public sample. Merely omitting explicit Ads tags from a new container does not establish that linked destinations cannot load. Test the network and fail closed if unexpected advertising destinations appear. A read-only container export/account review is needed for exhaustive old-trigger reconciliation.

## Keep, replace and omit — proposed for approval

| Observed service                                | Proposed decision                           | Reason / trigger                                                                           |
| ----------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| GA4 G-RC2WSP3DYG / Property 407144160           | Keep destination; recreate site integration | Analytics grant only; explicit single page_view and approved events below                  |
| Clarity yr1ps67xpa                              | Keep destination; recreate integration      | Analytics grant only; ConsentV2, advertising storage denied; no custom user identification |
| GTM-TLC2T6FQ                                    | Replace with owner-supplied clean container | Avoid inheriting undocumented custom HTML/advertising rules                                |
| Google tag GT-NB3VX8H                           | No separate copied loader                   | Owner validates GA4-only destination configuration; avoid duplicate/linked Ads loading     |
| Ads AW-11464482635                              | Omit from rebuild by default                | Advertising purpose/labels not verified; not required by the analytics-only brief          |
| Ads AW-18269807080                              | Omit from rebuild by default                | Same; page-visit conversion is not proof of signup success                                 |
| Floodlight DC-14019833                          | Omit from rebuild by default                | Business purpose and triggers unverified                                                   |
| Floodlight DC-14063874                          | Omit from rebuild by default                | Business purpose and triggers unverified                                                   |
| Mountain/MNTN (dx/gs/px.mountain.com)           | Omit from rebuild by default                | Advertising/retargeting is outside proposed necessary + analytics categories               |
| Legacy custom HTML / unknown vendors            | Do not copy blindly                         | Require owner-export evidence and explicit purpose/consent decision                        |
| Mailchimp embed scripts / legacy MxChat scripts | Do not restore                              | Native form remains mock; chatbot is a later phase                                         |

Omission is a proposal, not a finding that these campaigns are unwanted. If advertising must be retained, revise this plan with the campaign owner, exact triggers/labels and an appropriate consent category before implementing those tags.

## Event and trigger contract — proposed

All analytics delivery requires consent, no GPC/decline, an allowed environment and approved destination IDs. Before grant, no event backlog is retained for later replay. No names, email, phone, ZIP, user IDs, raw search/chat text, form values or full query strings enter analytics.

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

## Consent and loader behavior

Use a small native consent store/UI, with necessary and analytics categories, equally weighted Accept/Decline, EN/ES labels, persistent Privacy choices, same-origin persistence across paths/languages, and a versioned expiry policy (proposed 180 days, counsel review). Invalid/missing/expired choices default to denied.

Use basic blocking: queue denied Google Consent Mode v2 defaults locally, but load neither GTM/GA4 nor Clarity before analytics grant. Advertising consent fields remain denied even after analytics grant. Clarity uses consentv2 with analytics_Storage reflecting the choice and ad_Storage denied. SDK consent mode alone is insufficient to meet the requested no-request-before-consent policy: Google advanced mode and Clarity no-consent mode can still make requests. [Google consent modes](https://developers.google.com/tag-platform/security/concepts/consent-mode), [Clarity ConsentV2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).

GPC takes precedence over any stored grant: treat it as decline, do not nag with the banner, and explain the browser-controlled state in preferences. Proposed DNT handling is also decline. This is the project's requested behavior; counsel determines policy wording/applicability. [California AG GPC guidance](https://oag.ca.gov/privacy/ccpa/gpc).

On withdrawal, synchronously stop dispatch, communicate denial to already-loaded SDKs, clear applicable first-party analytics cookies and reload into the blocked state so loaded SDKs cannot keep collecting. Previously sent/queued network traffic cannot be retracted. Test fresh/stored decline and GPC for zero analytics requests, and withdrawal for cessation after the blocked reload; document any SDK termination/consent signaling.

## Environment and test-target decision

Ordinary previews and the current migration review alias remain analytics-off/mock. Production delivery additionally requires explicit launch approval and an approved real-domain allowlist; Vercel production environment alone is insufficient. No production analytics should load at yourcnastory.vercel.app during this migration.

The Phase 5 prompt asks for DebugView/Tag Assistant evidence on a preview while also prohibiting production analytics there. Proposed resolution: an explicitly configured, protected QA deployment using owner-provided non-production GA4 and Clarity destinations. Standard previews remain mock. QA configuration must reject the confirmed production IDs. Launch configuration reuses the confirmed existing production property/project.

Owner action needed: provide the clean GTM container ID and isolated QA destination IDs, or approve mock-only work with live DebugView evidence deferred. Do not silently use production IDs for a preview test. This decision must be resolved before live tag loading; it need not block disabled/mocked implementation after plan approval.

## Verification and deliverables after approval

- Typed event helper and event tests; server/client boundaries and installed Next.js docs checked before code changes.
- Native consent/banner/preferences, footer link, persistence and GPC/DNT tests in both languages; all proposed new Spanish UI strings logged.
- Network/storage matrix: fresh, accept, decline, stored choice, GPC overriding grant, withdrawal, language navigation, invalid/expired choice, missing config, ordinary preview and isolated QA.
- Owner applies container configuration guide/importable config; no agent account changes. Owner confirms stream settings to avoid duplicate automatic measurement.
- DebugView/Tag Assistant and Clarity evidence only on the approved isolated QA targets and only after consent. Confirm no duplicate pageviews or mock signup conversions.
- Production IDs remain disabled until release authorization. No live privacy policy replacement without counsel/owner approval.
