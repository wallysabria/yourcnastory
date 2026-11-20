# Training finder maintenance

Public data: `content/training/facilities.json`. This is the single facility list used by both languages. Facility names, street addresses and phone numbers are not translated. Stable IDs use facility name plus five-digit ZIP; review ID changes when names or locations change.

## Updating from Excel

1. Keep the source XLSX private/untracked. Run `python scripts/import-training-partners.py "PATH_TO_WORKBOOK"` with Python 3. The importer reads the first sheet with the existing six-column layout (Facility Name, ADDRESS, CITY, ZIP, PHONE, COUNTY), supports shared and inline strings, preserves ZIP+4, normalizes numeric ZIP values, and rejects duplicate IDs/missing fields.
2. Staging and Census batch CSV are written to ignored `_source/training-finder/`. Nothing in that folder is committed.
3. Submit only the public facility address CSV to the Census batch geocoder, not visitor data or the entire workbook:
   `curl --fail --form addressFile=@_source/training-finder/addresses.csv --form benchmark=4 --form vintage=4 https://geocoding.geo.census.gov/geocoder/geographies/addressbatch --output _source/training-finder/geocoded.csv`
4. Keep the documented Census ZIP-area archive as `_source/training-finder/zcta.zip` and CA counties file as `_source/training-finder/counties.txt`. The current version uses the 2025 Gazetteer national ZCTA archive and 2025 California counties file from https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/ . These are public-domain Census data; ZCTAs are statistical areas, not a complete USPS ZIP directory.
5. Run `python scripts/prepare-training-locations.py`. It rejects stale batch addresses, out-of-state matches and new county conflicts. Resolve source discrepancies with owner approval; preserve source values and record corrections. Unmatched/tied locations use the facility ZIP area's representative point and display an explicit distance caveat. A missing ZIP-area fallback stops preparation for manual review.
6. Run `node scripts/validate-training-finder.mjs`, lint/build and the finder tests. Review the changed dataset, geo matches/fallbacks, county/contact corrections and preview before merge.

## Runtime and limitations

ZIP-area coordinates are fetched only when a visitor submits a valid ZIP search. The browser downloads a fixed same-origin file and calculates Haversine straight-line distances locally. No visitor ZIP/keyword is put in a URL, request body, storage, or analytics event. The finder is Clarity-masked. It does not request geolocation. Directions opens Google Maps with only the facility address; that external provider receives its normal browser request after the visitor clicks.

Initial browse is alphabetical and shows nine cards; Show more reveals nine more. Search applies all selected filters together. County changes reset city to prevent stale selections. Radius defaults to 25 miles, with 10/25/50/100 options. ZIP+4 uses its first five digits. Unknown/PO-box-only ZIPs can be unsupported because they may lack a Census ZCTA; offer nearby ZIP/city/county browsing without guessing coordinates. Distances are estimates from the user's ZIP area's representative point, not driving distance or availability guarantees.

No paid map SDK, key, database, Redis, external request at search time or new runtime dependency is used. The static dataset works with the planned SiteGround Node.js hosting.
