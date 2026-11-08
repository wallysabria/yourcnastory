# Phase 7 crawler policy

Owner approved on 2026-11-08: allow search/discovery, block model training at eventual launch. The migration remains noindex and every crawler gets Disallow: / until the existing launch approval gate is true. No live gate was enabled by this phase.

Launch policy allows public crawling under '*', excludes internal/API/query-search URLs, and disallows GPTBot, ClaudeBot, Google-Extended and Applebot-Extended. OAI-SearchBot, Claude-SearchBot, Googlebot, Bingbot and Applebot inherit public discovery access. These are robots preferences for named compliant agents, not authentication or an exhaustive guarantee against scraping/training. No WAF setting is changed. User-requested fetchers may use different rules; never treat robots as protecting private content.

- [OpenAI crawler controls](https://developers.openai.com/api/docs/bots): GPTBot training and OAI-SearchBot search are independent.
- [Anthropic crawler controls](https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler): ClaudeBot and Claude-SearchBot serve different purposes.
- [Applebot](https://support.apple.com/en-us/119829): Applebot-Extended controls model-training use separately from Applebot search.
- [Google controls](https://developers.google.com/search/blog/2026/10/ai-training-control): Google-Extended also affects grounding eligibility in Gemini Apps. Blocking this mixed-purpose control prioritizes the approved no-training preference; ordinary Google Search crawling is not blocked. This does not promise discovery in every AI product.

Google's newly announced shared training policy token is still a draft/adoption mechanism. This implementation uses documented company-specific controls; review broader support before a later update rather than claiming universal coverage. A future standards change must not silently override staging disallow or the owner's training preference.
