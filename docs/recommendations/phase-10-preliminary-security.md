# Security/header review — preliminary QA

No production configuration or security headers changed in this pass.

- Pattern scan: 318 shipped source/content/public/client-asset files checked for private-key, AWS access-key, Anthropic/OpenAI key and GitHub-token patterns; zero matches. This is a bounded pattern scan, not proof that no secret can exist.
- Reader-facing HTML remains noindex; X-Powered-By is disabled. Optional SDKs and live signup remain gated/mocked under existing tests.
- /api/content-review returns inert public source content with no-store, noindex and restrictive CSP. It is a Phase 3 public-copy verification endpoint, not a chat-log review surface; there are no chat logs or implemented chatbot review pages to authenticate. Do not describe its 200 response as exposed private session data.
- Main document lacks application-level CSP, X-Content-Type-Options, Referrer-Policy and Permissions-Policy in the local baseline. Verify hosted headers separately; Vercel can add platform headers, including HSTS. Local absence is not proof of hosted absence.

## Concrete proposed header changes (inactive)

- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

A CSP needs a separate compatibility pass covering Next inline bootstrap hashes/nonces, preserved inline styles and requested YouTube/Vidyard playback, followed by final retained-vendor configuration. Do not enforce a guessed policy or add production vendor hosts merely to make warnings disappear. Prepare report-only evidence before proposing enforcement. No claim that a CSP is implemented or verified in this pass.

Review these header proposals and final CSP with the full-site Phase 10 security sign-off. Native browser/device, legal/counsel and live integration evidence remain separate gates.
