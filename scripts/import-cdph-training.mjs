import fs from 'node:fs';
import crypto from 'node:crypto';
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
const current = read('content/training/facilities.json');
const partners = read('content/training/partner-facilities.json');
const confirmed = new Set(read('content/training/earn-and-learn-confirmed.json').facilityIds);
const cdph = read('content/training/cdph-listings.json');
const areas = read('public/training-finder/zip-areas.json');
const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const addressKey = (s) =>
  normalize(s)
    .split(' ')
    .map(
      (w) =>
        ({
          avenue: 'ave',
          street: 'st',
          road: 'rd',
          drive: 'dr',
          boulevard: 'blvd',
          highway: 'hwy',
          parkway: 'pkwy',
          lane: 'ln',
          court: 'ct',
          north: 'n',
          south: 's',
          east: 'e',
          west: 'w',
          suite: 'ste',
        })[w] || w,
    )
    .join(' ');
const slug = (s) => normalize(s).replaceAll(' ', '-');
const digits = (s) => s.replace(/\D/g, '');
const phoneList = (s) =>
  [
    ...s.matchAll(
      /\(?([0-9]{3})\)?[\s.\-\u2010-\u2015]*([0-9]{3})[\s.\-\u2010-\u2015]*([0-9]{4})/g,
    ),
  ].map((m) => `(${m[1]}) ${m[2]}-${m[3]}`);
const uniquePhones = (list) =>
  list.filter((p, i) => list.findIndex((x) => digits(x) === digits(p)) === i);
const result = partners.facilities
  .filter((f) => confirmed.has(f.id))
  .map((f) => ({
    ...f,
    earnAndLearn: true,
    trainingTypes: [],
    phones: [f.phone],
    aliases: [],
    sourceRefs: ['workbook:' + f.sourceRow],
  }));
const issues = [];
let merged = 0;
for (const row of cdph.listings.filter((r) => r.type !== 'online')) {
  const phones = phoneList(row.phone),
    key = addressKey(row.address);
  const candidates = result.filter(
    (f) =>
      f.address &&
      addressKey(f.address) === key &&
      f.zip.slice(0, 5) === row.zip.slice(0, 5) &&
      (f.phones.some((p) => phones.some((x) => digits(x) === digits(p))) ||
        normalize(f.name) === normalize(row.name)),
  );
  let record;
  if (candidates.length === 1) {
    record = candidates[0];
    merged++;
    if (record.name !== row.name && !record.aliases.includes(row.name))
      record.aliases.push(row.name);
    record.phones = uniquePhones([...record.phones, ...phones]);
  } else {
    const id =
      'cdph-' +
      slug(row.name) +
      '-' +
      row.zip.slice(0, 5) +
      '-' +
      crypto.createHash('sha256').update(key).digest('hex').slice(0, 6);
    record = {
      id,
      name: row.name,
      address: row.address,
      city: row.city,
      state: 'CA',
      zip: row.zip,
      phone: phones[0] || '',
      phones,
      county: row.county,
      earnAndLearn: null,
      trainingTypes: [],
      aliases: [],
      sourceRefs: [],
      location: null,
    };
    const cache = current.facilities.find((f) => f.id === id && addressKey(f.address) === key);
    if (cache?.location) record.location = cache.location;
    result.push(record);
    if (candidates.length > 1)
      issues.push({ source: row.id, kind: 'ambiguous-existing-campus-kept-separate' });
  }
  if (!record.trainingTypes.includes(row.type)) record.trainingTypes.push(row.type);
  record.sourceRefs.push(row.id);
}
for (const row of cdph.listings.filter((r) => r.type === 'online')) {
  const phones = uniquePhones(phoneList(row.phone));
  let website = row.website;
  try {
    const url = new URL(website);
    if (!['http:', 'https:'].includes(url.protocol)) website = '';
  } catch {
    website = '';
  }
  const record = {
    id: 'cdph-online-' + slug(row.name),
    name: row.name.replace(/\s*\(Cannot train[^)]+\)/i, ''),
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    phone: phones[0] || '',
    phones,
    county: '',
    earnAndLearn: null,
    trainingTypes: ['online'],
    providerType: row.providerType,
    website,
    clinicalCities: row.clinicalCities,
    clinicalCounties: row.clinicalCounties,
    sourceNotes: row.notes,
    aliases: [],
    sourceRefs: [row.id],
    location: null,
  };
  if (!phones.length)
    issues.push({
      source: row.id,
      kind: 'phone-incomplete-use-website',
      sourcePhone: row.phone,
      provider: row.name,
    });
  result.push(record);
}
// Physical address geocodes are applied by the separate reviewed enrichment step.
for (const record of result.filter((f) => !f.location && f.address)) {
  const point = areas[record.zip.slice(0, 5)];
  if (point)
    record.location = {
      lat: point[0],
      lon: point[1],
      precision: 'zip-area',
      matchStatus: 'not-yet-address-matched',
    };
  else record.locationIssue = 'No Census ZIP area is available; browse/contact only.';
}
for (const source of cdph.sources) {
  source.sourceUpdated = { facility: '2026-02-13', online: '2026-02-18', community: '2026-09-30' }[
    source.id
  ];
  source.sourceUpdatedEvidence = 'Visible footer of the owner-provided attachment';
}
write('content/training/cdph-listings.json', cdph);
current.facilities = result;
current.source = partners.source;
current.source.additionalSources = cdph.sources.map((s) => ({
  id: s.id,
  url: s.url,
  rowCount: s.rowCount,
  attachment: s.attachment,
  attachmentSha256: s.attachmentSha256,
}));
write('content/training/facilities.json', current);
fs.mkdirSync('_source/training-finder/cdph', { recursive: true });
write('_source/training-finder/cdph/import-issues.json', issues);
const rows = result
  .filter((f) => f.address && !confirmed.has(f.id))
  .map((f) =>
    [f.id, f.address, f.city, 'CA', f.zip.slice(0, 5)]
      .map((x) => '"' + x.replaceAll('"', '""') + '"')
      .join(','),
  );
fs.writeFileSync('_source/training-finder/cdph/addresses.csv', rows.join('\n') + '\n');
console.log(
  JSON.stringify({
    sourceRows: cdph.listings.length,
    totalDirectoryRecords: result.length,
    physical: result.filter((f) => f.address).length,
    onlineProviders: result.filter((f) => !f.address).length,
    mergedSourceRows: merged,
    earnAndLearnConfirmed: result.filter((f) => f.earnAndLearn === true).length,
    issues,
  }),
);
