# Search Console 404 list — migration implications

Read-only audit of the 27 exact URLs transcribed from the owner screenshot. Both current public WordPress and the published Vercel rebuild were requested with redirect chains recorded. No WordPress, Search Console, routing or deployment settings changed.

## Findings

- Three existing migration redirects work: Vietnamese/Chinese careerpaths aliases go directly to /career-paths-in-long-term-care/; the Spanish FAQ -2 alias goes directly to /es/preguntas-frecuentes/. Each finishes at HTTP 200.
- Two content aliases remain 404 on the rebuild: /careerpaths/ and /es/preguntas-frecuente/. The current reference site directly redirects /careerpaths/ to /career-paths-in-long-term-care/, supplying destination evidence. The singular Spanish FAQ path remains 404 on both sites; /es/preguntas-frecuentes/ is a plausible intended destination, requiring owner confirmation before a new redirect.
- Fourteen legacy privacy-preference URLs: four English/Spanish cases return 404; ten Vietnamese/Chinese cases fall back to homepage. A homepage destination does not provide the requested privacy preferences. Preserve access to the actual privacy controls with approved exact aliases; propose an addressable settings control on the existing EN/ES privacy-policy page rather than recreating Complianz. The exact final URL/hash and any automatic settings opening require approval/implementation/testing.
- Three retired job-board URLs: Spanish is 404; Vietnamese and Chinese redirect to homepage under the generic retired-language fallback. Job board content must stay removed. Consider exact 404/410 exceptions for the latter two rather than an unrelated homepage redirect, subject to owner approval.
- Four literal wildcard URLs and one old Complianz API endpoint are not missing content pages. Rebuild responses are 404/403, except /vi/* which follows the generic homepage fallback. Do not restore the plugin or make broad redirects covering real uploads/theme paths. A literal star URL in this report does not mean every URL under that directory fails.

## Current migration health

All 57 built page HTML responses were inspected for links to the listed legacy pathnames: zero links found. Thus the screenshot reveals legacy-entry handling gaps rather than broken navigation in the new site. This is a snapshot check of rendered anchor hrefs, not proof about external backlinks, script-generated links or all historical Google discoveries.

The rebuild still returns X-Robots-Tag: noindex, nofollow, noarchive, as intended for staging. Search Console screenshot concerns https://yourcnastory.org. Fixes deployed only to the Vercel review hostname do not alter that domain until cutover. Preserve staging noindex; remove the launch gate only through the launch process.

## Recommended next implementation, pending approval

1. Add the source-evidenced /careerpaths/ alias and its slashless equivalent as direct 301s to /career-paths-in-long-term-care/.
2. Confirm and add the singular Spanish FAQ alias to /es/preguntas-frecuentes/, with slashless handling.
3. Define direct, functional legacy privacy-preference aliases, retaining Spanish UI for Spanish URLs and using English for retired Vietnamese/Chinese URLs. Strip obsolete clang parameters only on these aliases if approved. Avoid a redirect chain through homepage or a policy page with no accessible settings control.
4. Review precise retired-job-board and invalid-literal wildcard exceptions; retain genuine 404/410/403 behavior where no relevant replacement exists. Do not redirect all missing paths to homepage.
5. Verify all changed aliases after cutover on yourcnastory.org, then let Search Console validation finish. Pending does not mean Google has rechecked or approved an individual URL.

## Exact URL results

| Legacy path | Category | Reference HTTP chain | Rebuild HTTP chain | Rebuild final path |
|---|---|---|---|---|
| `/es/bolsa-de-trabajo-cna/` | Retired job board | 301 → 200 | 404 | `/es/bolsa-de-trabajo-cna/` |
| `/*` | Literal wildcard URL | 301 → 200 | 301 → 404 | `/*/` |
| `/vi/careerpaths/` | Already covered | 301 → 200 | 301 → 200 | `/career-paths-in-long-term-care/` |
| `/es/preguntas-frecuentes-2/` | Already covered | 301 → 200 | 301 → 200 | `/es/preguntas-frecuentes/` |
| `/careerpaths/` | Content alias gap | 301 → 200 | 404 | `/careerpaths/` |
| `/es/preferencias-de-exclusion/` | Legacy privacy preferences | 301 → 200 | 404 | `/es/preferencias-de-exclusion/` |
| `/es/preferencias-de-exclusion/?clang=en` | Legacy privacy preferences | 404 | 404 | `/es/preferencias-de-exclusion/?clang=en` |
| `/es/wp-json/complianz/v1/datarequests` | Retired plugin endpoint | 301 → 200 | 301 → 403 | `/es/wp-json/complianz/v1/datarequests/` |
| `/opt-out-preferences/` | Legacy privacy preferences | 301 → 200 | 404 | `/opt-out-preferences/` |
| `/zh/cna-职位板/` | Retired job board | 301 → 200 | 301 → 200 | `/` |
| `/wp-content/uploads/*` | Literal wildcard URL | 301 → 200 | 403 | `/wp-content/uploads/*` |
| `/vi/bang-viec-lam-cna/` | Retired job board | 301 → 200 | 301 → 200 | `/` |
| `/vi/cai-dat-tu-choi/` | Legacy privacy preferences | 301 → 200 | 301 → 200 | `/` |
| `/zh/careerpaths/` | Already covered | 301 → 200 | 301 → 200 | `/career-paths-in-long-term-care/` |
| `/zh/退出偏好设置/` | Legacy privacy preferences | 301 → 200 | 301 → 200 | `/` |
| `/vi/cai-dat-tu-choi/?clang=en` | Legacy privacy preferences | 301 → 200 | 301 → 200 | `/?clang=en` |
| `/opt-out-preferences/?clang=en` | Legacy privacy preferences | 301 → 200 | 404 | `/opt-out-preferences/?clang=en` |
| `/vi/cai-dat-tu-choi?clang=en` | Legacy privacy preferences | 301 → 200 | 301 → 200 | `/?clang=en` |
| `/vi/opt-out-preferences?clang=en` | Legacy privacy preferences | 301 → 200 | 301 → 200 | `/?clang=en` |
| `/vi/opt-out-preferences/?clang=en` | Legacy privacy preferences | 301 → 200 | 301 → 200 | `/?clang=en` |
| `/vi/*` | Literal wildcard URL | 404 | 301 → 200 | `/` |
| `/zh/退出偏好设置?clang=en` | Legacy privacy preferences | 404 | 301 → 200 | `/?clang=en` |
| `/zh/opt-out-preferences?clang=en` | Legacy privacy preferences | 301 → 404 | 301 → 200 | `/?clang=en` |
| `/zh/退出偏好设置/?clang=en` | Legacy privacy preferences | 404 | 301 → 200 | `/?clang=en` |
| `/zh/opt-out-preferences/?clang=en` | Legacy privacy preferences | 301 → 404 | 301 → 200 | `/?clang=en` |
| `/es/preguntas-frecuente/` | Content alias gap | 404 | 404 | `/es/preguntas-frecuente/` |
| `/wp-content/themes/dt-the7-child/*` | Literal wildcard URL | 404 | 403 | `/wp-content/themes/dt-the7-child/*` |

## Guidance

Google recommends a 301 when there is a clear replacement; genuinely removed pages without replacements can return 404/410. Irrelevant homepage redirects can be treated as soft 404s. https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors

Pending validation means an instance is queued for rechecking. Historic crawl dates are not a current HTTP test. https://support.google.com/webmasters/answer/7440203?hl=en
