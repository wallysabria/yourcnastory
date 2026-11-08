# Phase 6 storage proposal — for owner approval

Prepared 2026-11-08. **No database or account created.** Owner requested a storage proposal. This is separate from Anthropic API costs and requires approval before provisioning.

## Recommendation

Use **Neon Postgres in an owner-controlled account**, initially on Free for development and a small pilot. Use one database for redacted chat logs, protected review/reporting, shared rate limits and atomic spend reservations. This avoids adding a separate Redis/vector service. If the owner already has suitable Postgres, review that first instead of creating another account.

Current published Free allowances: $0/month, 1 GB database storage and 100 CU-hours/project/month. These are limits, not a promise that production will remain free. No paid upgrade, payment method, paid backup or additional service without explicit approval. [Neon pricing](https://neon.com/pricing), checked 2026-11-08.

## What it stores

- Redacted messages, locale/page, approved source IDs, fallback/signup flags, latency and token/cost usage.
- Short-lived abuse/rate-limit counters and transactional budget reservations.
- Internal review authentication state; no signup form fields or raw visitor IPs.

No raw production messages, credentials or personal lead data go into Git, test fixtures, client bundles or exported developer reports. Owner controls the account and credentials; application access is limited to its own database. Separate test data from production; approve region and backup/deletion behavior before launch.

## Cost and capacity expectations

A sizing example, not observed traffic: at 1,000 sessions/month, 12 months and roughly 30 KB/session including modest indexing, logs would use about 360 MB, before other tables/backups/growth. Measure actual record size and query cost during the approved pilot. Frequently updated shared counters can keep compute awake and exhaust the free compute allowance even when storage is small.

Track capacity and compute use, warn at agreed thresholds and stop new model calls safely if storage or mandatory logging fails. Never bypass rate/spend checks because the database is unavailable. An allowance-exhaustion event may make chat temporarily unavailable; it does not authorize upgrading automatically.

A paid plan, if later needed, is usage-based. Neon's pricing page shows $0.106/CU-hour and $0.35/GB-month for Launch; its illustrative typical spend is $15/month, **not a fixed quote or ceiling**. We would propose an exact operating budget after pilot measurements, and wait for approval before upgrading. Anthropic and Vercel costs are separate.

## Retention and administration

Redacted sessions expire after 12 calendar months; queries exclude expired data immediately and an authenticated daily cleanup deletes it. Review export copies and provider backup windows separately. Short-lived abuse counters expire much sooner. The internal session browser, search, summary and CSV export must all require server-side authentication, not just a hidden URL.

## Approval requested

Approve Neon Free as the initial storage service in an account you control, with no paid upgrades. Identify who should own/create the account and select the region before connection. Do not send database passwords or connection strings in chat; enter credentials through the approved secret setup after implementation planning is approved.
