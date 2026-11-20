# Finder dropdown and navigation update

Owner requested 2026-11-20.

Earn and Learn is now a Training type option in both languages. The separate checkbox is removed. The selector tests the existing confirmed earnAndLearn status, independently of CDPH categories; it includes only confirmed partners and still combines with ZIP/radius/city/county/name filters. No facility data or status changes.

Added Find a Training Facility / Encuentra un centro de capacitación under Career Seekers resources in both desktop and mobile navigation. Spanish wording is reused from the existing finder interface and logged.

Verification: lint, format check and production build passed; 28 existing finder/unit/header checks passed, including responsive EN/ES axe coverage and keyboard/touch header interactions. All four new desktop/mobile EN/ES links were clicked and reached the matching finder route. Screenshots: ignored _source/training-finder/menu-review/{en,es}-{1440,390}.png.
