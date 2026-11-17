'use client';
import { useRef, useState, type ReactNode } from 'react';
type Item = { title: string; titleId: string; panelId: string; body: ReactNode };
export function EmployerTabs({
  items,
  presentation = 'tabs',
}: {
  items: Item[];
  presentation?: 'tabs' | 'accordion';
}) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  if (presentation === 'accordion')
    return (
      <div className="cusp-levels">
        {items.map((item, i) => (
          <details key={item.panelId} className="cusp-level-card" open={i === 0}>
            <summary id={item.titleId}>
              <span>{item.title}</span>
              <span className="cusp-toggle" aria-hidden="true" />
            </summary>
            <div
              id={item.panelId}
              role="region"
              aria-labelledby={item.titleId}
              className="cusp-level-body"
            >
              {item.body}
            </div>
          </details>
        ))}
      </div>
    );
  return (
    <div className="the7-e-tabs-wrapper native-employer-tabs">
      <div className="the7-e-tabs-nav-wrapper">
        <div className="the7-e-tabs-nav-scroll-wrapper">
          <div
            className="the7-e-tabs-nav"
            role="tablist"
            aria-orientation="vertical"
            aria-label={items.map((i) => i.title.trim()).join(', ')}
          >
            {items.map((item, i) => (
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                type="button"
                key={item.titleId}
                id={item.titleId}
                className={'the7-e-tab-title ' + (active === i ? 'active' : '')}
                role="tab"
                aria-selected={active === i}
                aria-controls={item.panelId}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(event) => {
                  const next =
                    event.key === 'ArrowRight' || event.key === 'ArrowDown'
                      ? (i + 1) % items.length
                      : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
                        ? (i - 1 + items.length) % items.length
                        : event.key === 'Home'
                          ? 0
                          : event.key === 'End'
                            ? items.length - 1
                            : -1;
                  if (next >= 0) {
                    event.preventDefault();
                    setActive(next);
                    buttons.current[next]?.focus();
                  }
                }}
              >
                <span className="the7-e-tab-title-text">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="the7-e-tabs-content">
        {items.map((item, i) => (
          <div
            className={'the7-e-tab-item-wrapper ' + (active === i ? 'active' : '')}
            key={item.panelId}
          >
            <button
              className="the7-e-tab-title native-mobile-tab"
              type="button"
              aria-expanded={active === i}
              aria-controls={item.panelId}
              onClick={() => setActive(active === i ? -1 : i)}
            >
              {item.title}
            </button>
            <div
              id={item.panelId}
              role="tabpanel"
              aria-label={item.title.trim()}
              tabIndex={0}
              hidden={active !== i}
              className="the7-e-tab-content the7-e-tab-text-content"
            >
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
