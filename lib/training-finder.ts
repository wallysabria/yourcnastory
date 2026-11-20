export type Point = { lat: number; lon: number };
export type TrainingType = 'online' | 'community-based' | 'facility-based';
export type Facility = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  phones?: string[];
  county: string;
  earnAndLearn: boolean | null;
  trainingTypes: string[];
  aliases?: string[];
  website?: string;
  clinicalCities?: string[];
  clinicalCounties?: string[];
  sourceNotes?: string[];
  location: (Point & { precision: string }) | null;
};
export type FinderFilters = {
  query: string;
  city: string;
  county: string;
  radius: number;
  origin?: Point;
  trainingType?: string;
};
export const matchesTrainingType = (facility: Facility, type?: string) =>
  !type ||
  (type === 'earn-and-learn'
    ? facility.earnAndLearn === true
    : facility.trainingTypes.includes(type));
export const isOnlineProvider = (facility: Facility) =>
  facility.trainingTypes.includes('online') && !facility.address;
export const facilityCities = (facility: Facility) => [
  ...new Set([facility.city, ...(facility.clinicalCities || [])].filter(Boolean)),
];
export const facilityCounties = (facility: Facility) => [
  ...new Set([facility.county, ...(facility.clinicalCounties || [])].filter(Boolean)),
];
export function normalizeZip(value: string): string | null {
  const zip = value.trim();
  return /^\d{5}(?:-\d{4})?$/.test(zip) ? zip.slice(0, 5) : null;
}
export function distanceMiles(a: Point, b: Point): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const lat = radians(b.lat - a.lat),
    lon = radians(b.lon - a.lon);
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
  const useDistance = !!filters.origin && filters.trainingType !== 'online';
  return facilities
    .filter((f) => matchesTrainingType(f, filters.trainingType))
    .filter(
      (f) =>
        (!filters.city || facilityCities(f).includes(filters.city)) &&
        (!filters.county || facilityCounties(f).includes(filters.county)),
    )
    .filter((f) => {
      const haystack = comparable(
        [
          f.name,
          ...(f.aliases || []),
          ...facilityCities(f),
          ...facilityCounties(f),
          f.address,
          f.zip,
          ...f.trainingTypes,
        ].join(' '),
      );
      return terms.every((term) => haystack.includes(term));
    })
    .map((f) => ({
      ...f,
      distance:
        useDistance && filters.origin && f.location && !isOnlineProvider(f)
          ? distanceMiles(filters.origin, f.location)
          : undefined,
    }))
    .filter((f) => f.distance === undefined || f.distance <= filters.radius)
    .sort(
      (a, b) =>
        (useDistance ? Number(a.distance === undefined) - Number(b.distance === undefined) : 0) ||
        (a.distance !== undefined && b.distance !== undefined ? a.distance - b.distance : 0) ||
        a.name.localeCompare(b.name, 'en') ||
        a.id.localeCompare(b.id),
    );
}
export function directionsUrl(facility: Facility): string {
  if (!facility.address) return '';
  return (
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent(`${facility.address}, ${facility.city}, ${facility.state} ${facility.zip}`)
  );
}
