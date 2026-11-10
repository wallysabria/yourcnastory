# External page links open in new tabs

Owner requested a site-wide check and target="_blank" on external page links (D-017, 2026-11-10). Baseline across all 48 built EN/ES pages: 275 external HTTP/HTTPS link instances, 34 unique destinations, 101 missing the requested target. Of these, 96 were the shared foundation footer links; five were body/resource links, including an explicit _self link.

A shared external-link policy now covers source-rendered body links, SiteLink navigation/footer items, foundation logo/copyright links, announcement links and top-level navigation links. All 275 rendered external instances have target="_blank" plus rel="noopener noreferrer" (other existing rel tokens are preserved). The production/www/review domains count as internal; mailto/tel and other non-HTTP schemes retain their existing behavior. Existing internal targets are preserved, including existing document new-tab behavior. Video buttons still use lightboxes; Employer destinations remain inactive.

Every rendered link URL and text label was compared before/after across all pages and is unchanged. All internal/special-link targets also match the baseline. No content/metadata data files, translations, visual styles, uploads, destinations or integrations changed. External destinations were not crawled or submitted to; browser tests mock the foundation destination.

Verification: npm run lint; npm run build; npm run format:check; full regression 89/89 passes. New rendered-link test covers all 48 pages; EN/ES browser tests confirm a real additional tab opens, window.opener is null and the original page stays in place. Detailed evidence: external-links-new-tabs.json and external-links-new-tabs-tests.json. Browser/rendered evidence is from the local production build.

PR: https://github.com/wallysabria/yourcnastory/pull/16

Protected preview: https://yourcnastory-inao8kf3p-wallysabrias-projects.vercel.app/

Normal preview authentication retained; no temporary access credentials created. No merge/publication or phase advancement. Shared policy will apply to future migrated content through the same renderers, while Employers content remains gated.


## Publication — owner approved 2026-11-10

PR #16 merged as f9646746af7a160275223372759e66920dfc530c after all PR checks passed. Deployment https://yourcnastory-m8x5sutiu-wallysabrias-projects.vercel.app is READY and owns https://yourcnastory.vercel.app/. Public audit passed all 48 pages: 275 external instances/34 destinations have target="_blank" and noopener/noreferrer; 101 targets corrected versus the baseline. Exact URL/label comparisons and internal/special targets remain unchanged. Both EN/ES browser tests passed against the public review alias, confirming an additional tab opens with window.opener null and the source page stays in place; external destination responses were mocked. Evidence: external-links-new-tabs-production.json. Prior unpublished review notes are superseded. No custom-domain cutover, Employer enablement or integration changes.
