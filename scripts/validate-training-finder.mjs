import fs from 'node:fs';
import assert from 'node:assert/strict';
const data = JSON.parse(fs.readFileSync('content/training/facilities.json'));
const corrections = JSON.parse(fs.readFileSync('content/training/county-corrections.json'));
const phoneCorrections = JSON.parse(fs.readFileSync('content/training/phone-corrections.json'));
const areas = JSON.parse(fs.readFileSync('public/training-finder/zip-areas.json'));
assert.match(data.source.sha256, /^[a-f0-9]{64}$/);
assert.ok(data.facilities.length > 0);
const ids = new Set();
for (const facility of data.facilities) {
  for (const key of ['id', 'name', 'address', 'city', 'state', 'zip', 'phone', 'county'])
    assert.ok(typeof facility[key] === 'string' && facility[key].trim(), 'Missing facility ' + key);
  assert.ok(!ids.has(facility.id), 'Duplicate facility ID');
  ids.add(facility.id);
  if (facility.sourcePhone)
    assert.ok(
      phoneCorrections.some(
        (c) =>
          c.id === facility.id &&
          c.sourcePhone === facility.sourcePhone &&
          c.phone === facility.phone &&
          c.approved,
      ),
      'Unapproved phone correction',
    );
  assert.ok(
    Object.hasOwn(facility, 'earnAndLearn') && [true, false, null].includes(facility.earnAndLearn),
    'Program classification must be explicit',
  );
  assert.equal(facility.state, 'CA');
  assert.match(facility.zip, /^\d{5}(?:-\d{4})?$/);
  assert.match(facility.phone.replace(/\D/g, ''), /^1?\d{10}$/);
  assert.ok(['address-range', 'zip-area'].includes(facility.location?.precision));
  assert.ok(
    Number.isFinite(facility.location.lat) &&
      facility.location.lat >= 32 &&
      facility.location.lat <= 43,
  );
  assert.ok(
    Number.isFinite(facility.location.lon) &&
      facility.location.lon >= -125 &&
      facility.location.lon <= -114,
  );
  if (facility.location.precision === 'zip-area')
    assert.deepEqual(
      [facility.location.lat, facility.location.lon],
      areas[facility.zip.slice(0, 5)],
      'Stale ZIP fallback',
    );
  if (facility.sourceCounty)
    assert.ok(
      corrections.some(
        (c) =>
          c.id === facility.id &&
          c.sourceCounty === facility.sourceCounty &&
          c.county === facility.county &&
          c.approved,
      ),
      'Unapproved county correction',
    );
}
for (const [zip, point] of Object.entries(areas)) {
  assert.match(zip, /^\d{5}$/);
  assert.ok(Array.isArray(point) && point.length === 2 && point.every(Number.isFinite));
  assert.ok(Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180);
}
const ui = JSON.parse(fs.readFileSync('content/ui/training-finder.json'));
assert.deepEqual(Object.keys(ui.en).sort(), Object.keys(ui.es).sort());
for (const key of Object.keys(ui.en))
  assert.deepEqual(
    (ui.en[key].match(/\{\w+\}/g) || []).sort(),
    (ui.es[key].match(/\{\w+\}/g) || []).sort(),
    'Translation placeholders: ' + key,
  );
console.log(
  `Training finder: validated ${ids.size} public facilities, ${Object.keys(areas).length} ZIP areas and EN/ES interface parity.`,
);
