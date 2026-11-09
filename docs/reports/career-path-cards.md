# Career-path card presentation correction

Owner requested circular picture windows and formatting like the Career Seekers “Where will your new career take you?” carousel. D-009 is approved in the design log.

Scoped CSS targets only `.page-content[data-template="careerpath-index"] .e-loop-item`, shared by the EN/ES index. Portraits are 200px circles (smaller only if the container requires), clipped with border-radius/overflow and object-fit: cover. Centered titles use 20px/600/26px; descriptions use 17px/400/28.9px; spacing matches the measured carousel (15px below image, 10px before description). No red border: screenshot circles were annotations. Existing responsive grid, text, image sources, links, anchor IDs and carousel itself are unchanged.

Verification: lint, typecheck, format and build passed. Eight EN/ES views at 1440/1064/768/390 CSS px checked all 64 rendered cards for circle geometry, type and overflow; no document overflow. All 48 rendered page bodies/source anchors still match. Existing regression suite results and protected preview are attached at handoff. No new test/dependency, raster image edit or metadata change.

Evidence: career-path-cards.json; career-path-cards-rendered-parity.json; screenshots in career-path-cards/. Screenshot capture crops the grid from a full-page image at scroll zero to avoid sticky-header capture artifacts.

This is a separate CSS correction branch/PR. No merge or production publication without owner instruction. Existing Employers/chatbot/integration/indexing gates remain unchanged.
