# Phase 1 audit artifacts

Snapshot date: 2026-11-07. These files describe the existing site; none is application content or an applied redirect. Owner approved incomplete-source audit; see report limitations.

## Reproduce

Run in the repository root, on Node v24.14.1:

```powershell
npm install --prefix _source/audit-tools --no-save --package-lock=false cheerio@1.2.0 fast-xml-parser@5.12.0
node scripts/audit.mjs .
node scripts/enrich-audit.mjs .
node scripts/finalize-audit.mjs .
node scripts/validate-audit.mjs .
```

The first command installs audit-only parsers into ignored `_source/`; there is no app/package.json yet. The crawler reads the XML and robots.txt, discovers the declared sitemap, follows internal public links and hreflang, uses one in-flight HTTP request and >=800ms between starts, never submits forms, and caches HTML/HEAD responses locally. The snapshot date comes from actual observations, not file modification guesses.

Cached responses under `_source/audit-cache/` make reruns offline for already-seen URLs. Move/archive that directory manually before an intentionally fresh audit; do not mix snapshots without recording their dates. Browser evidence and screenshot captures are collected separately through the browser tool; the scripts do not fabricate rendered state or create missing screenshots. Supply the captured `browser-evidence.json`, `screenshots-index.json` and local ignored screenshot images before enrichment/finalization.

The validator uses only Node built-ins and can run in CI without raw exports or screenshot binaries. Use `--local` to additionally verify the local images and gitignore/raw-export checks. Source tables with absent database/archives are explicitly incomplete.

## Files

- URL manifest: observed status, metadata, language pair, section and evidence sources. `other` means owner scope decision. No unknown page is silently dropped.
- `source-reconciliation.csv`: sitemap/WXR/crawl/hreflang membership. A WXR attachment is not counted as a page. WXR totals include draft/template records; public content discovery excludes drafts.
- Redirects: every row is proposed; not installed anywhere. Retired-language mapping uses declared English counterparts per owner decision. Redirect chain targets are flattened where observed. Source URL casing/encoding is preserved.
- Anchors: linked IDs, final observed destination and existence. `elementor-actions.json` separates popup/lightbox instructions from document anchors.
- Uploads: public referenced media plus exported attachment candidates. `uploads-not-found-in-pages.csv` does **not** prove a file is unreferenced; full archive/CSS/document reconciliation is outstanding. Document paths remain unchanged.
- Forms, embeds, scripts, popup/widget records: exact public fields/placements, no submission data. Browser evidence strips visitor query identifiers from loaded tracking-script URLs.
- Screenshots: metadata committed; images local under ignored `docs/audit/screenshots/`. `screenshot-verification.json` records file signature/dimensions. Dynamic media and initial lazy loading are limitations.
- Issues: observations only; no content, accessibility or design fixes applied.

## Not claimed

Complete database-only inventory, complete uploads filesystem, external backlink evidence, PDF-outgoing-link extraction, conditional popup completeness, production-ready redirect coverage or visual/accessibility parity.
