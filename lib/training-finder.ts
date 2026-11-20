export type Point = { lat: number; lon: number };
export type Facility = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  county: string;
  location: Point & { precision: string };
};
export type FinderFilters = {
  query: string;
  city: string;
  county: string;
  radius: number;
  origin?: Point;
};
export function normalizeZip(value: string): string | null {
  const zip = value.trim();
  return /^\d{5}(?:-\d{4})?$/.test(zip) ? zip.slice(0, 5) : null;
}
export function distanceMiles(a: Point, b: Point): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const lat = radians(b.lat - a.lat);
  const lon = radians(b.lon - a.lon);
  const h =
    Math.sin(lat / 2) ** 2 +
    Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(lon / 2) ** 2;
  return 3958.7613 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, h))));
}
const comparable = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en-US');
export function findFacilities(facilities: Facility[], filters: FinderFilters) {
  const terms = comparable(filters.query.trim()).split(/\s+/).filter(Boolean);
  return facilities
    .filter(
      (facility) =>
        (!filters.city || facility.city === filters.city) &&
        (!filters.county || facility.county === filters.county),
    )
    .filter((facility) => {
      const haystack = comparable(
        [facility.name, facility.city, facility.county, facility.address, facility.zip].join(' '),
      );
      return terms.every((term) => haystack.includes(term));
    })
    .map((facility) => ({
      ...facility,
      distance: filters.origin ? distanceMiles(filters.origin, facility.location) : undefined,
    }))
    .filter((facility) => facility.distance === undefined || facility.distance <= filters.radius)
    .sort(
      (a, b) =>
        (a.distance !== undefined && b.distance !== undefined ? a.distance - b.distance : 0) ||
        a.name.localeCompare(b.name, 'en') ||
        a.id.localeCompare(b.id),
    );
}
export function directionsUrl(facility: Facility): string {
  const address = `${facility.address}, ${facility.city}, ${facility.state} ${facility.zip}`;
  return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address);
}
