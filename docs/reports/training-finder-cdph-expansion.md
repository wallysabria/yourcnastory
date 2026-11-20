# Training finder: CDPH expansion

Updated 2026-11-20. Branch: codex/standalone-training-finder; PR #28.

## Result

The standalone EN/ES finder includes all 717 rows from the owner-supplied CDPH lists: 563 community-based, 87 facility-based and 67 online. After conservative campus consolidation and retaining the original 71 partners, it contains 684 directory entries (617 physical sites and 67 online listings). These are directory entries, not a claim of 684 unique businesses. All source rows are retained and referenced exactly once. 104 source rows consolidate into existing campus records; aliases preserve alternate program names/shifts.

Category membership: 491 community-based sites, 87 facility-based sites and 67 online provider listings. Another 39 original partners have no CDPH category confirmed. Only the original 71 owner-confirmed partners receive Earn and Learn badges; new CDPH entries have unknown funding status.

The Training type filter and badges work in EN/ES. Online listings show their original clinical cities/counties and website/phone contacts, without fabricated campuses or distances. Original clinical cities and counties are independent lists. Shared provider brands do not imply Earn and Learn participation. Existing blue patterned header and page links remain intact.

## Source fidelity and exceptions

content/training/cdph-listings.json records source rows, supplied attachment names/hashes and the matching public CDPH tables. Attachment footer dates: facility February 13, online February 18, community September 30, 2026. Raw downloaded HTML and PDF images remain ignored under _source.

546 physical sites use Census address-range matches; 64 use explicitly labeled ZIP-area representative points. Seven physical listings without usable coordinates remain searchable with no distance claim. All 67 online entries have no physical coordinate. Visitor ZIP searches remain entirely local and are not transmitted to Census or analytics.

Reconsideration is included exactly as listed, following the owner's explicit instruction. Its PO Box has no distance estimate. Health Star Academy's source phone is incomplete; preserve it in the audit, omit an invalid Call link and use its listed website. Fountain View's historical restriction and Lakeside's employee-only note are retained as source notes with current-status confirmation requested. Original owner-approved county and Delta Oaks phone corrections remain intact.

## Verification

- npm run lint: passed.
- npm run build: passed, including source coverage and coordinate/contact validation.
- Playwright finder unit, browser, content and SEO suite: 31 passed.
- EN/ES keyboard, overflow and axe checks at 320, 390, 768 and 1440 px passed; expanded online card axe check passed.
- Reviewed online provider desktop/mobile card screenshots under ignored _source/training-finder/screenshots/online-card-{desktop,mobile}.png. Long clinical lists wrap within the card; no false directions link or distance appears.
- Source coverage validator requires every one of the 717 source row IDs exactly once and preserves all 71 confirmed partner IDs.

## Review

Preview: https://yourcnastory-git-codex-standalone-81435a-wallysabrias-projects.vercel.app/find-a-training-facility/
Spanish preview: https://yourcnastory-git-codex-standalone-81435a-wallysabrias-projects.vercel.app/es/encuentra-un-centro-de-capacitacion/

New Spanish interface strings are logged for native review. Preview remains blocked from indexing. This PR is awaiting owner review before merge/publication.
