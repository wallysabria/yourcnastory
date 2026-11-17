'use client';
import { useEffect, useRef, useState } from 'react';
import labels from '@/content/ui/awards.json';
type Item = { label: string; id: string };
export function AwardNavigation({ items }: { items: Item[] }) {
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState(items[0]?.id || '');
  useEffect(() => {
    let frame = 0;
    const root = nav.current?.closest<HTMLElement>('.awards-scope');
    const header = document.querySelector<HTMLElement>('.site-header');
    const update = () => {
      frame = 0;
      const headerHeight = Math.max(0, header?.getBoundingClientRect().bottom || 0);
      const navHeight = nav.current?.getBoundingClientRect().height || 0;
      const desktop = matchMedia('(min-width:768px)').matches;
      root?.style.setProperty('--awards-header-height', headerHeight + 'px');
      root?.style.setProperty(
        '--awards-scroll-offset',
        headerHeight +
          (desktop ? navHeight : 0) +
          24 -
          (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) +
          'px',
      );
      const line = headerHeight + (desktop ? navHeight : 0) + 64;
      let next = items[0]?.id || '';
      for (const item of items) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= line) next = item.id;
      }
      setActive(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    if (header) observer.observe(header);
    if (nav.current) observer.observe(nav.current);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    schedule();
    void document.fonts.ready.then(() => {
      if (!nav.current) return;
      update();
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target && root?.contains(target))
          target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, [items]);
  return (
    <nav ref={nav} className="awards-jump" aria-label={labels.jumpLabel}>
      <span className="awards-jump-label">{labels.jumpLabel}</span>
      <div className="awards-jump-items">
        {items.map((item) => (
          <a
            key={item.id}
            href={'#' + item.id}
            aria-current={active === item.id ? 'location' : undefined}
            onClick={(event) => {
              if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
                return;
              const target = document.getElementById(item.id);
              if (!target) return;
              event.preventDefault();
              if (location.hash !== '#' + item.id) history.pushState(null, '', '#' + item.id);
              target.scrollIntoView({ block: 'start', behavior: 'instant' });
              target.focus({ preventScroll: true });
              setActive(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
