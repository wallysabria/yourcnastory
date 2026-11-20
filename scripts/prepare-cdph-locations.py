"""Enrich only supplied physical campuses; never geocode online service cities as addresses."""
import csv,json,pathlib,collections,re
base=pathlib.Path('_source/training-finder/cdph')
p=pathlib.Path('content/training/facilities.json');data=json.loads(p.read_text(encoding='utf8'));rows={r[0]:r for r in csv.reader((base/'locations.csv').open(encoding='utf8'))};issues=[]
for record in data['facilities']:
    row=rows.get(record['id'])
    if not row: continue
    expected=', '.join([record['address'],record['city'],'CA',record['zip'][:5]])
    if row[1].replace(chr(92),'')!=expected.replace(chr(92),''):raise ValueError('Stale geocode: '+record['id'])
    matched_zip=re.search(r', CA, (\d{5})$',row[4]) if row[2]=='Match' else None
    if row[2]=='Match' and matched_zip and matched_zip.group(1)==record['zip'][:5]:
        lon,lat=map(float,row[5].split(','))
        if not(32<=lat<=43 and -125<=lon<=-114):raise ValueError('Unexpected location outside CA bounds')
        record['location']=dict(lat=round(lat,6),lon=round(lon,6),precision='address-range',matchedAddress=row[4])
    else:
        if record['location']:record['location']['matchStatus']=row[2] if row[2]!='Match' else 'ZIP-mismatch'
        issues.append(dict(id=record['id'],name=record['name'],status=row[2],fallback='zip-area' if record['location'] else 'browse-only'))
p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(base/'geocode-issues.json').write_text(json.dumps(issues,indent=2)+'\n',encoding='utf8')
print(json.dumps({'rows':len(rows),'results':dict(collections.Counter(r[2] for r in rows.values())),'directoryPrecision':dict(collections.Counter(f['location']['precision'] if f['location'] else 'online-or-unmapped' for f in data['facilities'])),'fallbacks':len(issues)}))
