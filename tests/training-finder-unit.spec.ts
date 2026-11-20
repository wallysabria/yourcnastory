import { test, expect } from '@playwright/test';
import data from '../content/training/facilities.json' with { type: 'json' };
import { directionsUrl, distanceMiles, findFacilities, normalizeZip } from '../lib/training-finder';
const filters = { query: '', city: '', county: '', radius: 25 };
test('ZIP parsing accepts ZIP+4 and rejects malformed input without guessing', () => {
  expect(normalizeZip(' 94087-1234 ')).toBe('94087');
  expect(normalizeZip('02108')).toBe('02108');
  for (const value of ['', '9408', '940870', '94087.0', '94087abc', '94 087', '<script>'])
    expect(normalizeZip(value)).toBeNull();
});
test('distance calculation agrees with equatorial reference and handles identical/antipodal points', () => {
  expect(distanceMiles({ lat: 0, lon: 0 }, { lat: 0, lon: 1 })).toBeCloseTo(69.0934, 2);
  expect(distanceMiles({ lat: 37, lon: -122 }, { lat: 37, lon: -122 })).toBe(0);
  expect(Number.isFinite(distanceMiles({ lat: 0, lon: 0 }, { lat: 0, lon: 180 }))).toBe(true);
});
test('name, city and verified county filters combine; radius sorts nearest first', () => {
  const idylwood = data.facilities.find((f) => f.name === 'Idylwood Care Center')!;
  expect(idylwood.county).toBe('Santa Clara');
  expect(idylwood.sourceCounty).toBe('Alameda');
  expect(
    findFacilities(data.facilities, {
      ...filters,
      query: 'IDYLWOOD',
      city: 'Sunnyvale',
      county: 'Santa Clara',
    }).map((f) => f.id),
  ).toEqual([idylwood.id]);
  expect(
    findFacilities(data.facilities, { ...filters, query: 'Idylwood', county: 'Alameda' }),
  ).toEqual([]);
  const nearby = findFacilities(data.facilities, {
    ...filters,
    origin: idylwood.location,
    radius: 10,
  });
  expect(nearby[0].id).toBe(idylwood.id);
  expect(
    nearby.every((f, i) => f.distance! <= 10 && (!i || f.distance! >= nearby[i - 1].distance!)),
  ).toBe(true);
  expect(
    findFacilities(data.facilities, {
      ...filters,
      origin: { lat: 40.75, lon: -73.99 },
      radius: 100,
    }),
  ).toEqual([]);
});
test('fallback facilities remain discoverable and directions contain only facility addresses', () => {
  for (const facility of data.facilities.filter((f) => f.location.precision === 'zip-area')) {
    const matches = findFacilities(data.facilities, {
      ...filters,
      query: facility.name,
      origin: facility.location,
      radius: 10,
    });
    expect(matches.some((f) => f.id === facility.id)).toBe(true);
    const url = new URL(directionsUrl(facility));
    expect(url.searchParams.get('destination')).toContain(facility.address);
    expect(url.searchParams.has('origin')).toBe(false);
  }
});
