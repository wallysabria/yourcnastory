'use client';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/content-schema';
import messages from '@/content/ui/search.json';
import { SearchIcon, CloseIcon } from './icons';
type Result = { url: string; meta: { title?: string }; excerpt: string };
type Index = { search: (query: string) => Promise<{ results: { data: () => Promise<Result> }[] }> };
const decode = (text: string) =>
  text
    .replace(/<[^>]*>/g, '')
    .replace(/&(amp|lt|gt|quot|apos|nbsp|#\d+|#x[\da-f]+);/gi, (whole, entity: string) => {
      const named: Record<string, string> = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
        nbsp: ' ',
      };
      if (named[entity]) return named[entity];
      const value = entity.startsWith('#x')
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : whole;
    });
export function SearchDialog({ locale }: { locale: Locale }) {
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    input = useRef<HTMLInputElement>(null),
    sequence = useRef(0),
    index = useRef<Index | null>(null);
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(''),
    [results, setResults] = useState<Result[]>([]),
    [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const t = messages[locale];
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(() => {
    const current = ++sequence.current;
    if (!query.trim()) {
      return;
    }
    const timer = setTimeout(async () => {
      setState('loading');
      try {
        if (!index.current) {
          const url = '/pagefind/pagefind.js';
          index.current = (await import(
            /* webpackIgnore: true */ /* turbopackIgnore: true */ url
          )) as Index;
        }
        const response = await index.current.search(query);
        const data = await Promise.all(
          response.results.slice(0, 30).map((result) => result.data()),
        );
        if (current !== sequence.current) return;
        setResults(
          data.filter(
            (result) =>
              result.url.startsWith('/') &&
              !result.url.startsWith('//') &&
              (locale === 'es' ? result.url.startsWith('/es/') : !result.url.startsWith('/es/')),
          ),
        );
        setState('ready');
      } catch {
        if (current === sequence.current) setState('error');
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query, locale]);
  function close() {
    dialog.current?.close();
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="search-toggle icon-button"
        aria-label={t.open}
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
          input.current?.focus();
        }}
      >
        <SearchIcon />
      </button>
      <dialog
        ref={dialog}
        className="site-search-dialog"
        aria-label={t.open}
        onCancel={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClose={() => setOpen(false)}
      >
        <button
          type="button"
          className="search-close icon-button"
          aria-label={t.close}
          onClick={close}
        >
          <CloseIcon />
        </button>
        <div className="search-inner">
          <form
            role="search"
            className="search-input-shell"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              ref={input}
              type="search"
              value={query}
              placeholder={t.placeholder}
              aria-label={t.open}
              aria-controls="site-search-results"
              autoComplete="off"
              onChange={(event) => {
                sequence.current++;
                setQuery(event.target.value);
                if (!event.target.value) {
                  setResults([]);
                  setState('idle');
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  const first =
                    dialog.current?.querySelector<HTMLAnchorElement>('.search-results a');
                  if (first) {
                    event.preventDefault();
                    first.focus();
                  }
                }
              }}
            />
            {query && (
              <button
                type="button"
                className="search-clear icon-button"
                aria-label={t.clear}
                onClick={() => {
                  sequence.current++;
                  setQuery('');
                  setResults([]);
                  setState('idle');
                  input.current?.focus();
                }}
              >
                <CloseIcon />
              </button>
            )}
            <button type="submit" className="search-submit icon-button" aria-label={t.open}>
              <SearchIcon />
            </button>
          </form>
          <p role="status" className="search-status">
            {state === 'loading'
              ? t.loading
              : state === 'error'
                ? t.unavailable
                : state === 'ready'
                  ? results.length === 0
                    ? t.none
                    : results.length === 1
                      ? t.one
                      : t.count.replace('{count}', String(results.length))
                  : ''}
          </p>
          <ul id="site-search-results" className="search-results" aria-label={t.results}>
            {results.map((result) => (
              <li key={result.url}>
                <a href={result.url}>{decode(result.meta.title || result.url)}</a>
                <p>{decode(result.excerpt)}</p>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
