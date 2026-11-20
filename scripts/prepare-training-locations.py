import csv, json, zipfile, pathlib, collections, datetime, hashlib
base = pathlib.Path('_source/training-finder')
data = json.loads((base/'import.json').read_text(encoding='utf8'))
geocodes = {r[0]: r for r in csv.reader((base/'geocoded.csv').open(encoding='utf8'))}
with zipfile.ZipFile(base/'zcta.zip') as archive:
    text = archive.read(archive.namelist()[0]).decode('utf-8-sig')
    delim = '|' if '|' in text.splitlines()[0] else '\t'
    records = list(csv.DictReader(text.splitlines(), delimiter=delim))
centers = {r['GEOID']: [round(float(r['INTPTLAT'].strip()), 6), round(float(r[next(k for k in r if k.strip() == 'INTPTLONG')].strip()), 6)] for r in records}
text = (base/'counties.txt').read_text(encoding='utf-8-sig')
counties = {r['GEOID']: r['NAME'].removesuffix(' County') for r in csv.DictReader(text.splitlines(), delimiter='|' if '|' in text.splitlines()[0] else '\t')}
correction_path = pathlib.Path('content/training/county-corrections.json')
corrections = json.loads(correction_path.read_text(encoding='utf8'))
approved = {r['id']: r for r in corrections}
phone_decisions = {r['id']: r for r in json.loads(pathlib.Path('content/training/phone-corrections.json').read_text(encoding='utf8'))}
for record in data['facilities']:
    if 'earnAndLearn' not in record: raise ValueError('Reimport with explicit --earn-and-learn yes/no/unknown classification')
    decision = phone_decisions.get(record['id'])
    if decision and record['phone'] == decision['sourcePhone']:
        record['sourcePhone'] = record['phone']; record['phone'] = decision['phone']
    row = geocodes[record['id']]
    expected = ', '.join([record['address'], record['city'], 'CA', record['zip'][:5]])
    if row[1] != expected: raise ValueError('Stale geocode: '+record['id'])
    if row[2] == 'Match':
        lon, lat = map(float, row[5].split(','))
        if row[8] != '06': raise ValueError('Address matched outside California')
        record['location'] = dict(lat=round(lat, 6), lon=round(lon, 6), precision='address-range', matchedAddress=row[4])
        county = counties[row[8]+row[9]]
        if county != record['county']:
            decision = approved.get(record['id'])
            if not decision or decision['sourceCounty'] != record['county'] or decision['county'] != county:
                raise ValueError('New county mismatch requires owner approval: '+record['id'])
            record['sourceCounty'] = record['county']; record['county'] = county
    else:
        lat, lon = centers[record['zip'][:5]]
        record['location'] = dict(lat=lat, lon=lon, precision='zip-area', matchStatus=row[2])
data['source'].update(dict(importedAt=datetime.datetime.now(datetime.timezone.utc).date().isoformat(), geocoder='https://geocoding.geo.census.gov/geocoder/geographies/addressbatch', benchmark='Public_AR_Current', vintage='Current_Current', zipAreas='https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_zcta_national.zip', zipAreasSha256=hashlib.sha256((base/'zcta.zip').read_bytes()).hexdigest()))
pathlib.Path('content/training/partner-facilities.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
pathlib.Path('public/training-finder/zip-areas.json').write_text(json.dumps(centers, separators=(',', ':'))+'\n', encoding='utf8')
print('Prepared', len(data['facilities']), 'facilities and', len(centers), 'ZIP areas:', dict(collections.Counter(r['location']['precision'] for r in data['facilities'])))
