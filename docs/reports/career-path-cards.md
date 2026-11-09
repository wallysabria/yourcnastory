# Career-path card presentation correction

Owner requested circular picture windows and formatting like the Career Seekers “Where will your new career take you?” carousel. D-009 is approved in the design log.

Scoped CSS targets only `.page-content[data-template="careerpath-index"] .e-loop-item`, shared by the EN/ES index. Portraits are 200px circles (smaller only if the container requires), clipped with border-radius/overflow and object-fit: cover. Centered titles use 20px/600/26px; descriptions use 17px/400/28.9px; spacing matches the measured carousel (15px below image, 10px before description). No red border: screenshot circles were annotations. Existing responsive grid, text, image sources, links, anchor IDs and carousel itself are unchanged.

Verification: lint, typecheck, format and build passed. Eight EN/ES views at 1440/1064/768/390 CSS px checked all 64 rendered cards for circle geometry, type and overflow; no document overflow. All 48 rendered page bodies/source anchors still match. All 70 existing regression tests passed. Protected preview independently passed the same eight EN/ES viewport checks (64 cards), preserved card titles/destinations and noindex. Temporary test access was revoked, retaining normal preview authentication. No new test/dependency, raster image edit or metadata change.

Evidence: career-path-cards.json; career-path-cards-rendered-parity.json; screenshots in career-path-cards/. Screenshot capture crops the grid from a full-page image at scroll zero to avoid sticky-header capture artifacts.

This is a separate CSS correction branch/PR. No merge or production publication without owner instruction. Existing Employers/chatbot/integration/indexing gates remain unchanged.


## Review

PR: https://github.com/wallysabria/yourcnastory/pull/10

Verified protected preview: https://yourcnastory-n6i1ocp92-wallysabrias-projects.vercel.app/career-paths-in-long-term-care/

Verified runtime SHA: 319c7a473a53841ef2f2577b9b155e976cb9b8f6. Documentation-only follow-up commits do not change application styling.

![Corrected English grid at screenshot width](career-path-cards-preview/en-1064.png)

Phone and Spanish screenshots are in career-path-cards-preview/. Existing public alias remains unchanged pending merge/publication approval.


## Publication — owner approved 2026-11-09

Owner requested publication. PR #10 merged as cf6079c844e283a16bc9881dfc9ca2cd35ef8ebf after all checks passed. Vercel production deployment https://yourcnastory-9yzia904h-wallysabrias-projects.vercel.app is READY and owns https://yourcnastory.vercel.app/. Public EN/ES verification passed eight desktop/tablet/phone views (64 cards): visible square portrait windows clipped to circles, 20px centered titles, 17px descriptions, unchanged title/link records and no overflow. Evidence: career-path-cards-production.json. Earlier unmerged/unpublished notes describe the review stage and are superseded. Indexing and integration gates remain unchanged; no custom-domain cutover.
