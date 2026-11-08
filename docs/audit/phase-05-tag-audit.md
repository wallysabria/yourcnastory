# Phase 5 — Read-only public tag audit

Captured 2026-11-08T17:59:35.633Z. Owner authorized this public audit in chat. Source: https://yourcnastory.org/ and the in-scope EN/ES pages below. Detailed sanitized evidence is ignored at _source/integrations/tag-audit/public-tag-audit.json; a shareable summary is phase-05-tag-audit.json. Reproduce with node scripts/audit-public-tags.mjs (public visits can generate ordinary legacy analytics traffic).

## Method

Six fresh desktop browser contexts. Five seconds after DOMContentLoaded, then a full-page scroll and two further seconds. One homepage context sends Sec-GPC: 1 and exposes navigator.globalPrivacyControl=true. No live lead/application forms submitted, no consent choices clicked, no synthetic lead events dispatched, no account configuration changes. Lead-form POST requests were blocked. Only tag IDs, host/path, event names, consent signal strings, cookie names/domains and storage key names were retained; no cookie values, visitor IDs, full query strings, collection payloads or HAR.

| Page | GPC | Observed tag requests | Observed event parameters | Cookie names |
|---|---|---:|---|---|
| / | Off | 22 | page_view, gtag.config | ANONCHK, CLID, MR, MR, MUID, MUID, SM, SRM_B, _clck, _clsk, _ga, _ga_RC2WSP3DYG, _gcl_au, _mpxl_guid, guid, rt, test_cookie, tt |
| /es/ | Off | 22 | page_view, gtag.config | ANONCHK, CLID, MR, MR, MUID, MUID, SM, SRM_B, _clck, _clsk, _ga, _ga_RC2WSP3DYG, _gcl_au, _mpxl_guid, guid, rt, test_cookie, tt |
| /career-seekers/ | Off | 31 | page_view, conversion, gtag.config | ANONCHK, CLID, IDE, MR, MR, MUID, MUID, SM, SRM_B, _clck, _clsk, _ga, _ga_RC2WSP3DYG, _gcl_au, _mpxl_guid, guid, rt, tt |
| /es/aspirantes/ | Off | 22 | page_view, gtag.config | ANONCHK, CLID, MR, MR, MUID, MUID, SM, SRM_B, _clck, _clsk, _ga, _ga_RC2WSP3DYG, _gcl_au, _mpxl_guid, guid, rt, test_cookie, tt |
| /privacy-policy/ | Off | 22 | page_view, gtag.config | ANONCHK, CLID, MR, MR, MUID, MUID, SM, SRM_B, _clck, _clsk, _ga, _ga_RC2WSP3DYG, _gcl_au, _mpxl_guid, guid, rt, test_cookie, tt |
| / | On | 15 | page_view, gtag.config | _ga, _ga_RC2WSP3DYG, _gcl_au, _mpxl_guid, guid, rt, test_cookie, tt |

## Findings

- The confirmed GA4 G-RC2WSP3DYG issues a page_view request in every scenario, including GPC. Property 407144160 and Clarity yr1ps67xpa are owner-confirmed; the property number itself cannot be established from browser requests.
- Legacy GTM-TLC2T6FQ and Google tag GT-NB3VX8H load. Google Ads AW-11464482635 / AW-18269807080, Floodlight DC-14019833 / DC-14063874 and MNTN/Mountain hosts are observed. These are discovery facts, not approval to recreate them.
- Initial Career Seekers navigation issues Google Ads conversion requests without any form submission. This may be an intentional page-visit conversion; labels/purpose are unverified. It must not be copied as a signup-success trigger.
- GA, Google Ads and Mountain cookies/requests are observed without a consent choice. No consent controls or dataLayer consent commands were found within this sample/window; this does not prove global absence in all regions or sessions.
- In the GPC scenario, GA4, advertising and Mountain requests/cookies still appear. Clarity loader/requests are present, but its first-party cookies were not observed there. That single comparison is not proof of Clarity's full GPC behavior or legal compliance.
- The dataLayer exposes gtm.js, gtm.dom, gtm.load and gtm.scrollDepth. A GA4 scroll event was not observed in this short sample. The public compiled container includes Google tag, advertising/Floodlight and custom HTML function types; exact custom triggers/tag names are not recoverable exhaustively from these observations.
- Mailchimp stylesheet requests are presentation assets, not signup analytics events. No signup success, document-download, outbound-click, search or chat conversion was deliberately exercised; those remain unverified from this run.

## Limits and recommendation

Public sampling cannot establish every tag, account setting, trigger, conversion label, custom dimension, retention setting or enhanced-measurement toggle. A read-only GTM export/owner account review remains necessary for exhaustive reconciliation. No Employers pages were visited for this new audit. The earlier whole-site inventory remains historical evidence.

Proposed replacement decisions are in docs/integrations/tag-plan.md. This audit is a technical observation, not a legal compliance determination. No replacement tracking or consent UI has been implemented.
