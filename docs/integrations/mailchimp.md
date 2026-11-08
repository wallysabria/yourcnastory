# Mailchimp — Phase 4 mock boundary

The source audience configuration folder `_source/integrations/mailchimp/` is missing. Per the approved Phase 4 scope, `/api/signup/` validates and returns an explicit mock response. It has no Mailchimp adapter, credentials, audience ID, or external network call. The interface tells the visitor that no subscription was created. Production connection remains a gate.

## Observed browser field names (not verified API mappings)

| Native field | Source browser name | Required |
|---|---|---|
| First name | FNAME | Yes |
| Last name | LNAME | Yes |
| ZIP | MMERGE4 | Yes |
| Email | EMAIL | Yes |
| SMS phone | SMSPHONE | No |
| Language | MMERGE3; source values English / Español | Yes |
| Country code | Native `countryCode`, default +1 | With SMS |

These names come from public HTML and must not be treated as authoritative Mailchimp merge tags. Audience ID, data-center prefix, merge field types, tags, groups, language storage, phone normalization and SMS consent/subscription semantics must be cross-checked against supplied audience configuration. The original EN/ES SMS disclosure and terms link remain verbatim. No automatic marketing consent is inferred from an optional number.

## Behavior and safety

Client and server share the validation schema. Names, US ZIP, email, language and optional national/international phone are validated; phone length includes country code. Accessible field errors, pending/disabled state, failure/rate-limit states and synchronous double-submit guard are present. Honeypot submissions bypass the transport. Responses are no-store/noindex. No PII is logged or stored.

The route limits six requests per ten minutes per hashed trusted IP in process memory (bounded map). This is a preview safeguard, not a durable distributed production rate limiter; revisit before live integration. Origin and body-size checks are enforced.

Unit tests inject an in-memory fake transport for created/existing subscriber and API-down cases. The route never accepts a transport from requests. Both successful fake cases report mock acceptance, never claim a real subscription. A `signup_submitted` CustomEvent carries only language and `mode: mock`; no analytics library is loaded. Phase 5 must not count mock events as real conversions.

Before connecting: receive verified audience mappings, agree secret environment names, implement the server-only adapter, and obtain owner approval for a test audience or dedicated test tag. Never test against the live audience without that approval.
