"""Import the public partner workbook; requires only Python's standard library.
Usage: python scripts/import-training-partners.py PATH_TO_WORKBOOK
Writes an ignored staging file and Census batch CSV, never the original workbook.
"""
import csv, hashlib, json, pathlib, re, sys, xml.etree.ElementTree as ET, zipfile
source = pathlib.Path(sys.argv[1])
ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(source) as archive:
    shared = [''.join(x.itertext()) for x in ET.fromstring(archive.read('xl/sharedStrings.xml')).findall('m:si', ns)] if 'xl/sharedStrings.xml' in archive.namelist() else []
    workbook = ET.fromstring(archive.read('xl/workbook.xml'))
    sheet = workbook.find('m:sheets', ns)[0]
    relationships = {x.attrib['Id']: x.attrib['Target'] for x in ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))}
    target = relationships[sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']]
    target = target.lstrip('/') if target.startswith('/') else 'xl/' + target
    rows = []
    for row in ET.fromstring(archive.read(target)).findall('.//m:sheetData/m:row', ns):
        cells = {}
        for cell in row.findall('m:c', ns):
            value = cell.find('m:v', ns)
            value = value.text if value is not None else ''
            if cell.attrib.get('t') == 's': value = shared[int(value)] if value else ''
            elif cell.attrib.get('t') == 'inlineStr': value = ''.join(cell.find('m:is', ns).itertext())
            if value: cells[re.sub(r'\d', '', cell.attrib['r'])] = value.strip()
        if cells: rows.append((int(row.attrib['r']), cells))
    expected = ['Facility Name', 'ADDRESS', 'CITY', 'ZIP', 'PHONE', 'COUNTY']
    header_index = next(i for i, (_, row) in enumerate(rows) if [row.get(k) for k in 'ABCDEF'] == expected)
    facilities = []
    phone_decisions = json.loads(pathlib.Path('content/training/phone-corrections.json').read_text(encoding='utf8'))
    for row_number, row in rows[header_index + 1:]:
        if not row.get('A'): continue
        if any(not row.get(c) for c in 'ABCDEF'): raise ValueError(f'Incomplete public record at row {row_number}')
        zipcode = re.sub(r'\.0$', '', row['D'])
        if not re.fullmatch(r'\d{5}(?:-\d{4})?', zipcode): raise ValueError(f'Invalid ZIP at row {row_number}')
        identifier = re.sub(r'[^a-z0-9]+', '-', row['A'].lower()).strip('-') + '-' + zipcode[:5]
        if len(re.sub(r'\D', '', row['E'])) not in (10, 11) and not any(c['id'] == identifier and c['sourcePhone'] == row['E'] for c in phone_decisions): raise ValueError(f'Invalid phone needs review at row {row_number}')
        facilities.append(dict(id=identifier, name=row['A'], address=row['B'], city=row['C'], state='CA', zip=zipcode, phone=row['E'], county=row['F'], sourceRow=row_number))
    if len({r['id'] for r in facilities}) != len(facilities): raise ValueError('Duplicate facility IDs need review')
    output = pathlib.Path('_source/training-finder'); output.mkdir(parents=True, exist_ok=True)
    provenance = dict(filename=source.name, sha256=hashlib.sha256(source.read_bytes()).hexdigest(), sheet=sheet.attrib['name'])
    (output/'import.json').write_text(json.dumps(dict(source=provenance, facilities=facilities), ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    with (output/'addresses.csv').open('w', newline='', encoding='utf8') as f:
        writer = csv.writer(f)
        for record in facilities: writer.writerow([record['id'], record['address'], record['city'], 'CA', record['zip'][:5]])
    print(f'Validated {len(facilities)} public facilities; staging and batch addresses written under _source/training-finder/')
