# Privacy content findings and decisions

This is an operational/content review, not a determination that a particular privacy law applies or that the site is legally compliant. Current policy remains unchanged. Legal reviewer assignment is pending.

## Confirmed business details

Quality Care Health Foundation; privacy requests to info@yourcnastory.org; email plus optional SMS intended at launch, with consent/terms verified before release. Reviewer must decide whether a postal contact, additional entity/agency details or other disclosures are required and supply accurate details rather than placeholders.

## High-priority old-policy mismatches

| Item | Current evidence | Proposed resolution / gate |
|---|---|---|
| Contact details | Existing EN/ES policy contains dkapoor@ihca.org and mneel@cahf.org. | Owner confirmed info@yourcnastory.org for the new draft. Confirm who monitors the inbox and owns requests; do not silently promise a workflow the team cannot operate. |
| Password request | Existing children paragraph asks for the same username/email/password submitted by the child. | Remove password-request language in the approved replacement. Draft asks visitors not to send passwords or sensitive records in an initial email. |
| Date/scope | Existing policy says March 15, 2019 and includes member accounts, purchases/conferences, broad recipient sharing and employment/education history. These are not the implemented signup fields and app features inspected here. | Owner/legal reviewer must define the policy's scope: this website versus wider QCHF/CAHF services. Do not reuse organization-wide claims as statements about functions this app does not provide. Set the effective date only on actual publication. |
| Collection description | The old general-user section says no personal information is collected, while the site has signup/contact/provider-hosted form interactions and hosting/security requests. | Describe actual request information, voluntary submissions and permitted vendor collection clearly. Do not call hashed IP or all vendor data anonymous by default. |
| Marketing and recipients | Old wording permits broad recruitment disclosure and marketing contact without consent. | Confirm actual intended recipients, purposes and business process. Do not assert new mailing/SMS/advertising practices without approved mappings and consent behavior. |
| Vendor disclosures | Intended GA4, Clarity, Ads, Floodlight, MNTN, Mailchimp, external players/Forms and planned SiteGround hosting are not adequately reconciled in the 2019 copy. | Use integration-disclosures.md and account-specific evidence. Review sale/sharing characterizations, roles, contracts and transfers with the legal reviewer. A list of vendor names is not complete sign-off. |
| Retention/rights | Mailing/contact/Forms/hosting/vendor retention and request verification/deletion/appeal handling have not been supplied. | Owner/legal reviewer supplies actual periods or criteria, responsible staff, applicable rights and operating procedure. No invented time limit, automatic deletion promise or universal rights assertion. |
| Children/minors | Source has an under-13 policy and a removal process, but the new request workflow has not been confirmed. | Confirm intended audience/age policy and a safe process with the reviewer. Do not silently change eligibility guidance or claim a deletion workflow was tested. |

## Current versus launch disclosure boundaries

- Review host: Vercel. Planned production host: SiteGround Node.js, per owner. Final hosting disclosure must be verified after that migration, including logs, account entity, access and retention.
- Mailchimp/SMS: mock now, no subscription or SMS sent by the route. Launch wording is conditional on a real adapter, verified audience/mappings, optional SMS consent/terms and safe live validation. Owner wants both email and optional SMS; that is not confirmation of completed integration.
- Analytics/advertising: IDs and retention choice are known; actual account configuration, conversions and per-category consent are not live-verified. Do not publish “we do not sell/share” or “all data is anonymous” by inference.
- Consent: implemented 180-day browser choice, separate analytics/advertising, default denied, GPC/DNT override, withdrawal and persistent footer controls. Legacy privacy links now reach the same settings. These controls do not prove account-side vendor data handling or deletion of previously collected data.
- External media and Microsoft Forms: load only after the visitor chooses to load them. Loading contacts that provider; external forms have their own processing and recipient/access settings. No live form submission was tested.
- Train and Gain inquiry form: disabled placeholder; do not describe it as sending an inquiry.
- Chat: paused/not active. OpenAI and proposed Supabase logging/redaction/retention need a later operational review before a chatbot notice can describe them as actual practice.

## Decisions still needed for publication

1. Assign native Spanish and privacy/legal reviewers and record their verdicts.
2. Confirm the privacy inbox owner, request process, policy scope, mailing/SMS program identity and whether a postal contact is needed.
3. Supply the final SMS disclosure/terms and verified Mailchimp consent/subscription setup; keep phone optional.
4. Approve data recipients, retention, applicable rights/verification, minors language and vendor-role/transfer disclosures.
5. Reconcile GTM/Clarity/advertising configuration and verify live behavior before using unconditional production wording.
6. Approve the complete English draft, then its Spanish counterpart and exact proposed changes; only then implement/publish.
