import fs from 'node:fs';
import assert from 'node:assert/strict';
const read = (p) => JSON.parse(fs.readFileSync(p));
const data = read('content/training/facilities.json'),
  areas = read('public/training-finder/zip-areas.json'),
  cdph = read('content/training/cdph-listings.json');
const corrections = read('content/training/county-corrections.json'),
  phoneCorrections = read('content/training/phone-corrections.json');
const sourceDecisions = read('content/training/source-decisions.json');
for (const decision of sourceDecisions)
  assert.ok(
    cdph.listings.some((r) => r.id === decision.sourceId && r.name === decision.name) &&
      decision.approved,
  );
const confirmed = new Set(read('content/training/earn-and-learn-confirmed.json').facilityIds),
  ids = new Set(),
  refs = [];
assert.match(data.source.sha256, /^[a-f0-9]{64}$/);
for (const f of data.facilities) {
  for (const key of ['id', 'name', 'state']) assert.ok(typeof f[key] === 'string' && f[key].trim());
  assert.ok(!ids.has(f.id), 'Duplicate facility ID');
  ids.add(f.id);
  assert.equal(f.state, 'CA');
  assert.ok(
    Object.hasOwn(f, 'earnAndLearn') && [true, false, null].includes(f.earnAndLearn),
    'Explicit program status required',
  );
  if (f.earnAndLearn === true) assert.ok(confirmed.has(f.id), 'Unconfirmed Earn and Learn claim');
  if (confirmed.has(f.id)) assert.equal(f.earnAndLearn, true, 'Lost owner-confirmed status');
  assert.ok(
    Array.isArray(f.trainingTypes) &&
      f.trainingTypes.every((t) => ['online', 'community-based', 'facility-based'].includes(t)),
  );
  const online = f.trainingTypes.includes('online') && !f.address;
  if (!online) {
    for (const k of ['address', 'city', 'county', 'zip'])
      assert.ok(f[k]?.trim(), 'Missing physical ' + k);
    assert.match(f.zip, /^\d{5}(?:-\d{4})?$/);
  } else {
    assert.equal(f.location, null, 'Do not assign online clinical cities a physical coordinate');
    assert.ok(f.clinicalCities.length > 0 && f.clinicalCounties.length > 0);
  }
  const phones = f.phones || [f.phone];
  for (const phone of phones) assert.match(phone.replace(/\D/g, ''), /^1?\d{10}$/);
  assert.ok(phones.length || f.website, 'No usable contact method');
  if (f.website) assert.ok(['http:', 'https:'].includes(new URL(f.website).protocol));
  if (f.sourcePhone)
    assert.ok(
      phoneCorrections.some(
        (c) =>
          c.id === f.id && c.sourcePhone === f.sourcePhone && c.phone === f.phone && c.approved,
      ),
    );
  if (f.sourceCounty)
    assert.ok(
      corrections.some(
        (c) =>
          c.id === f.id && c.sourceCounty === f.sourceCounty && c.county === f.county && c.approved,
      ),
    );
  if (f.location) {
    assert.ok(['address-range', 'zip-area'].includes(f.location.precision));
    assert.ok(Number.isFinite(f.location.lat) && f.location.lat >= 32 && f.location.lat <= 43);
    assert.ok(Number.isFinite(f.location.lon) && f.location.lon >= -125 && f.location.lon <= -114);
    if (f.location.precision === 'zip-area')
      assert.deepEqual([f.location.lat, f.location.lon], areas[f.zip.slice(0, 5)]);
  } else assert.ok(online || f.locationIssue, 'Missing unmapped-location explanation');
  refs.push(...f.sourceRefs.filter((r) => !r.startsWith('workbook:')));
}
for (const id of confirmed) assert.ok(ids.has(id), 'Missing original Earn and Learn provider');
assert.deepEqual(
  [...refs].sort(),
  cdph.listings.map((r) => r.id).sort(),
  'Every CDPH source row must map exactly once',
);
for (const s of cdph.sources) {
  assert.equal(cdph.listings.filter((r) => r.id.startsWith(s.id + ':')).length, s.rowCount);
  assert.match(s.attachmentSha256, /^[a-f0-9]{64}$/);
}
for (const [zip, point] of Object.entries(areas)) {
  assert.match(zip, /^\d{5}$/);
  assert.ok(Array.isArray(point) && point.length === 2 && point.every(Number.isFinite));
  assert.ok(Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180);
}
const ui = read('content/ui/training-finder.json');
assert.deepEqual(Object.keys(ui.en).sort(), Object.keys(ui.es).sort());
for (const key of Object.keys(ui.en))
  assert.deepEqual(
    (ui.en[key].match(/\{\w+\}/g) || []).sort(),
    (ui.es[key].match(/\{\w+\}/g) || []).sort(),
  );
console.log(
  `Training finder: ${ids.size} directory records; ${refs.length} CDPH rows accounted for; ${confirmed.size} confirmed Earn and Learn facilities; ${Object.keys(areas).length} ZIP areas.`,
);
