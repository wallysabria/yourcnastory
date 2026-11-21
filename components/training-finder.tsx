'use client';
import { useId, useMemo, useRef, useState, type FormEvent } from 'react';
import labels from '@/content/ui/training-finder.json';
import {
  directionsUrl,
  facilityCities,
  facilityCounties,
  isOnlineProvider,
  matchesTrainingType,
  findFacilities,
  normalizeZip,
  type Facility,
  type FinderFilters,
} from '@/lib/training-finder';
import type { Locale } from '@/lib/content-schema';
const pageSize = 9;
const initialFilters = {
  query: '',
  city: '',
  county: '',
  radius: 25,
  trainingType: '',
};
const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
type ZipAreas = Record<string, [number, number]>;
let zipAreas: Promise<ZipAreas> | undefined;
async function loadZipAreas() {
  if (zipAreas) return zipAreas;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  zipAreas ||= fetch('/training-finder/zip-areas.json', {
    signal: controller.signal,
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
  })
    .then(async (response) => {
      if (!response.ok) throw Error('ZIP area file unavailable');
      return response.json() as Promise<ZipAreas>;
    })
    .catch((error: unknown) => {
      zipAreas = undefined;
      throw error;
    })
    .finally(() => clearTimeout(timeout));
  return zipAreas;
}
export function TrainingFinder({ locale, facilities }: { locale: Locale; facilities: Facility[] }) {
  const text = labels[locale];
  const id = useId();
  const zipInput = useRef<HTMLInputElement>(null);
  const [zip, setZip] = useState('');
  const [draft, setDraft] = useState(initialFilters);
  const [applied, setApplied] = useState<FinderFilters & { zip?: string }>(initialFilters);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [limit, setLimit] = useState(pageSize);
  const counties = useMemo(
    () => [...new Set(facilities.flatMap(facilityCounties))].sort(),
    [facilities],
  );
  const cities = useMemo(
    () =>
      [
        ...new Set(
          facilities
            .filter(
              (facility) =>
                (!draft.county || facilityCounties(facility).includes(draft.county)) &&
                matchesTrainingType(facility, draft.trainingType),
            )
            .flatMap(facilityCities),
        ),
      ].sort(),
    [facilities, draft.county, draft.trainingType],
  );
  const results = useMemo(() => findFacilities(facilities, applied), [facilities, applied]);
  const shown = results.slice(0, limit);
  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const onlineOnly = draft.trainingType === 'online';
    const normalized = onlineOnly ? null : normalizeZip(zip);
    if (!onlineOnly && zip.trim() && !normalized) {
      setError(text.invalidZip);
      zipInput.current?.focus();
      return;
    }
    setBusy(true);
    try {
      const coordinates = normalized ? (await loadZipAreas())[normalized] : undefined;
      if (
        normalized &&
        (!Array.isArray(coordinates) ||
          coordinates.length !== 2 ||
          !coordinates.every(Number.isFinite))
      ) {
        setError(text.unknownZip);
        zipInput.current?.focus();
        return;
      }
      setApplied({
        ...draft,
        zip: normalized || undefined,
        origin: coordinates ? { lat: coordinates[0], lon: coordinates[1] } : undefined,
      });
      setLimit(pageSize);
    } catch {
      setError(text.loadError);
      zipInput.current?.focus();
    } finally {
      setBusy(false);
    }
  }
  function clear() {
    setZip('');
    setDraft(initialFilters);
    setApplied(initialFilters);
    setError('');
    setLimit(pageSize);
  }
  return (
    <>
      <div className="finder-hero">
        <div className="finder-hero-pattern" aria-hidden="true" />
        <h1 id={id + '-title'}>{text.title}</h1>
      </div>
      <section
        id="training-finder"
        className="training-finder"
        aria-labelledby={id + '-title'}
        data-clarity-mask="true"
      >
        <div className="finder-intro">
          <p className="finder-eyebrow">{text.eyebrow}</p>
          <p>{text.intro}</p>
        </div>
        <form className="finder-form" onSubmit={search} aria-label={text.title} aria-busy={busy}>
          <div className="finder-primary">
            <div className="finder-field">
              <label htmlFor={id + '-zip'}>{text.zip}</label>
              <input
                ref={zipInput}
                id={id + '-zip'}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={10}
                value={zip}
                disabled={busy || draft.trainingType === 'online'}
                onChange={(event) => {
                  setZip(event.target.value);
                  setError('');
                }}
                aria-describedby={id + '-zip-hint' + (error ? ' ' + id + '-error' : '')}
                aria-invalid={!!error}
              />
              <small id={id + '-zip-hint'}>{text.zipHint}</small>
            </div>
            <div className="finder-field">
              <label htmlFor={id + '-radius'}>{text.radius}</label>
              <select
                id={id + '-radius'}
                disabled={busy || !zip.trim() || draft.trainingType === 'online'}
                value={draft.radius}
                onChange={(event) => setDraft({ ...draft, radius: Number(event.target.value) })}
              >
                {[10, 25, 50, 100].map((miles) => (
                  <option value={miles} key={miles}>
                    {fill(text.within, { miles })}
                  </option>
                ))}
              </select>
            </div>
            <div className="finder-field finder-query">
              <label htmlFor={id + '-query'}>{text.query}</label>
              <input
                id={id + '-query'}
                type="search"
                maxLength={100}
                autoComplete="off"
                disabled={busy}
                value={draft.query}
                onChange={(event) => setDraft({ ...draft, query: event.target.value })}
              />
            </div>
          </div>
          <div className="finder-program">
            <div className="finder-field">
              <label htmlFor={id + '-type'}>{text.trainingType}</label>
              <select
                id={id + '-type'}
                value={draft.trainingType}
                disabled={busy}
                onChange={(event) => {
                  setDraft({ ...draft, trainingType: event.target.value, county: '', city: '' });
                  setError('');
                }}
              >
                <option value="">{text.allTypes}</option>
                <option value="earn-and-learn">{text.earnAndLearn}</option>
                <option value="online">{text.online}</option>
                <option value="community-based">{text.communityBased}</option>
                <option value="facility-based">{text.facilityBased}</option>
              </select>
            </div>
          </div>
          <div className="finder-secondary">
            <div className="finder-field">
              <label htmlFor={id + '-county'}>{text.county}</label>
              <select
                id={id + '-county'}
                disabled={busy}
                value={draft.county}
                onChange={(event) => setDraft({ ...draft, county: event.target.value, city: '' })}
              >
                <option value="">{text.allCounties}</option>
                {counties.map((county) => (
                  <option key={county}>{county}</option>
                ))}
              </select>
            </div>
            <div className="finder-field">
              <label htmlFor={id + '-city'}>{text.city}</label>
              <select
                id={id + '-city'}
                disabled={busy}
                value={draft.city}
                onChange={(event) => setDraft({ ...draft, city: event.target.value })}
              >
                <option value="">{text.allCities}</option>
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="finder-actions">
              <button type="submit" className="finder-submit" disabled={busy}>
                {busy ? text.searching : text.search}
              </button>
              <button type="button" className="finder-clear" disabled={busy} onClick={clear}>
                {text.clear}
              </button>
            </div>
          </div>
          <p className="finder-privacy">{text.privacy}</p>
          {error && (
            <p id={id + '-error'} className="finder-error" role="alert">
              {error}
            </p>
          )}
        </form>
        <div className="finder-results" aria-busy={busy}>
          <div className="finder-results-heading">
            <h2>{text.results}</h2>
            <p role="status" aria-live="polite" aria-atomic="true">
              {fill(text.count, { shown: shown.length, count: results.length })}
            </p>
          </div>
          <p className="finder-search-summary">
            {applied.zip ? fill(text.near, { zip: applied.zip, radius: applied.radius }) : text.all}
          </p>
          {applied.origin && <p className="finder-distance-note">{text.approximate}</p>}
          {applied.trainingType === 'online' ? (
            <p className="finder-distance-note">{text.onlineOnlyNote}</p>
          ) : applied.origin && results.some((f) => !f.location) ? (
            <p className="finder-distance-note">{text.onlineSearchNote}</p>
          ) : null}
          {results.length === 0 ? (
            <div className="finder-empty">
              <h3>{text.empty}</h3>
              <p>{text.emptyHelp}</p>
              <button type="button" className="finder-clear" onClick={clear}>
                {text.clear}
              </button>
            </div>
          ) : (
            <ul className="finder-cards">
              {shown.map((facility) => (
                <li key={facility.id} className="finder-card" data-facility-id={facility.id}>
                  <p className="finder-county">{facility.county || text.online}</p>
                  <h3>{facility.name}</h3>
                  <div className="finder-type-badges">
                    {facility.trainingTypes.map((type) => (
                      <span className="finder-type-badge" key={type}>
                        {type === 'online'
                          ? text.online
                          : type === 'community-based'
                            ? text.communityBased
                            : text.facilityBased}
                      </span>
                    ))}
                  </div>
                  {facility.earnAndLearn === true && (
                    <p className="finder-badge">{text.earnAndLearn}</p>
                  )}
                  {!!facility.aliases?.length && (
                    <details className="finder-aliases">
                      <summary>{text.alsoListedAs}</summary>
                      <ul>
                        {facility.aliases.map((alias) => (
                          <li key={alias}>{alias}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                  {facility.address ? (
                    <address>
                      {facility.address}
                      <br />
                      {facility.city}, {facility.state} {facility.zip}
                    </address>
                  ) : (
                    <p className="finder-online-description">{text.onlineDescription}</p>
                  )}
                  {isOnlineProvider(facility) && (
                    <details className="finder-clinical-areas">
                      <summary>{text.clinicalLocations}</summary>
                      <p>
                        <strong>{text.clinicalCities}: </strong>
                        {facility.clinicalCities?.join(', ')}
                      </p>
                      <p>
                        <strong>{text.clinicalCounties}: </strong>
                        {facility.clinicalCounties?.join(', ')}
                      </p>
                    </details>
                  )}
                  {facility.address && !facility.location && (
                    <p className="finder-location-note">{text.unmappedLocation}</p>
                  )}
                  {!!facility.sourceNotes?.length && (
                    <details className="finder-source-note">
                      <summary>{text.sourceNote}</summary>
                      {facility.sourceNotes.map((note) => (
                        <p lang="en" key={note}>
                          {note}
                        </p>
                      ))}
                    </details>
                  )}
                  {facility.distance !== undefined && (
                    <div className="finder-distance">
                      <p>
                        {fill(text.distance, {
                          miles: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
                            facility.distance,
                          ),
                        })}
                      </p>
                      {facility.location?.precision === 'zip-area' && (
                        <small>{text.zipDistance}</small>
                      )}
                    </div>
                  )}
                  <div className="finder-card-links">
                    {(facility.phones || [facility.phone])
                      .filter((phone) => /^1?\d{10}$/.test(phone.replace(/\D/g, '')))
                      .map((phone) => (
                        <a
                          key={phone}
                          href={'tel:' + phone.replace(/[^\d+]/g, '')}
                          aria-label={
                            fill(text.callFacility, { name: facility.name }) + ': ' + phone
                          }
                        >
                          <span>{text.call}</span> {phone}
                        </a>
                      ))}
                    {facility.address && (
                      <a
                        href={directionsUrl(facility)}
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer"
                        aria-label={fill(text.directionsFacility, { name: facility.name })}
                      >
                        {text.directions}
                        <span aria-hidden="true"> ↗</span>
                      </a>
                    )}
                    {facility.website && (
                      <a
                        href={facility.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer"
                        aria-label={fill(text.websiteFacility, { name: facility.name })}
                      >
                        {text.website}
                        <span aria-hidden="true"> ↗</span>
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {shown.length < results.length && (
            <button
              className="finder-more"
              type="button"
              onClick={() => setLimit(limit + pageSize)}
            >
              {text.more}
            </button>
          )}
        </div>
        <p className="finder-notice">{text.notice}</p>
        <noscript>
          <p>{text.noScript}</p>
        </noscript>
      </section>
    </>
  );
}
