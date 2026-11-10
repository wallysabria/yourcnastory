'use client';
import { useEffect, useId, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import labels from '@/content/ui/widgets.json';
import type { Locale } from '@/lib/content-schema';
function Glyph({ kind }: { kind: 'previous' | 'next' | 'pause' | 'play' | 'close' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {kind === 'previous' ? (
        <path d="m15 5-7 7 7 7" />
      ) : kind === 'next' ? (
        <path d="m9 5 7 7-7 7" />
      ) : kind === 'close' ? (
        <path d="m5 5 14 14M19 5 5 19" />
      ) : kind === 'pause' ? (
        <path d="M8 4v16M16 4v16" />
      ) : (
        <path d="m8 4 12 8-12 8Z" />
      )}
    </svg>
  );
}
export function AccordionItem({
  className,
  titleId,
  panelId,
  title,
  children,
}: {
  className: string;
  titleId: string;
  panelId: string;
  title: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <button
        type="button"
        id={titleId}
        className={'elementor-tab-title' + (open ? ' elementor-active' : '')}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        {title}
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={titleId}
        hidden={!open}
        className={'elementor-tab-content elementor-clearfix' + (open ? ' elementor-active' : '')}
      >
        {children}
      </div>
    </div>
  );
}
export function Carousel({
  className,
  locale,
  columns,
  tablet,
  mobile,
  gap,
  autoplay,
  interval,
  children,
}: {
  className: string;
  locale: Locale;
  columns: number;
  tablet: number;
  mobile: number;
  gap: number;
  autoplay: boolean;
  interval: number;
  children: ReactNode[];
}) {
  const track = useRef<HTMLDivElement>(null),
    [paused, setPaused] = useState(true),
    [index, setIndex] = useState(0),
    [hover, setHover] = useState(false),
    [height, setHeight] = useState<number>();
  const t = labels[locale];
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setPaused(!autoplay || query.matches);
    change();
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, [autoplay]);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const step = (el.firstElementChild?.getBoundingClientRect().width || el.clientWidth) + gap;
      const visible = Math.max(1, Math.round((el.clientWidth + gap) / step));
      const items = Array.from(el.children).slice(index, index + visible);
      setHeight(Math.max(0, ...items.map((item) => item.getBoundingClientRect().height)));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    Array.from(el.children).forEach((item) => observer.observe(item));
    measure();
    return () => observer.disconnect();
  }, [index, gap]);
  function move(direction: number) {
    const el = track.current;
    if (!el) return;
    const step = (el.firstElementChild?.getBoundingClientRect().width || el.clientWidth) + gap;
    const visible = Math.max(1, Math.round((el.clientWidth + gap) / step));
    const end = Math.max(0, children.length - visible);
    const next = index + direction < 0 ? end : index + direction > end ? 0 : index + direction;
    setIndex(next);
    el.scrollTo({
      left: next * step,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
  useEffect(() => {
    if (paused || hover) return;
    const id = setInterval(() => move(1), interval || 6000);
    return () => clearInterval(id);
  }, [paused, hover, index, interval]); // eslint-disable-line react-hooks/exhaustive-deps
  const style = {
    '--native-columns': columns,
    '--native-tablet-columns': tablet,
    '--native-mobile-columns': mobile,
    '--native-gap': gap + 'px',
  } as CSSProperties;
  return (
    <div
      className={className + ' native-carousel owl-loaded owl-drag'}
      style={style}
      role="region"
      aria-roledescription={t.carousel}
      aria-label={t.carousel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHover(false);
      }}
    >
      <div className="owl-stage-outer" style={height ? { height } : undefined}>
        <div
          className="owl-stage"
          ref={track}
          tabIndex={0}
          onScroll={(event) => {
            const el = event.currentTarget;
            const step =
              (el.firstElementChild?.getBoundingClientRect().width || el.clientWidth) + gap;
            setIndex(Math.round(el.scrollLeft / step));
          }}
          aria-label={t.carousel}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              move(1);
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              move(-1);
            }
          }}
        >
          {children.map((child, i) => (
            <div key={i} className="owl-item active">
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="owl-nav" data-content-control data-pagefind-ignore>
        <button type="button" className="owl-prev" aria-label={t.previous} onClick={() => move(-1)}>
          <Glyph kind="previous" />
        </button>
        <button type="button" className="owl-next" aria-label={t.next} onClick={() => move(1)}>
          <Glyph kind="next" />
        </button>
      </div>
      {autoplay && (
        <button
          className="native-motion-toggle"
          type="button"
          data-content-control
          data-pagefind-ignore
          aria-label={paused ? t.play : t.pause}
          onClick={() => setPaused(!paused)}
        >
          <Glyph kind={paused ? 'play' : 'pause'} />
        </button>
      )}
    </div>
  );
}
export function BackgroundVideo({
  src,
  locale,
  playOnMobile = false,
}: {
  src: string;
  locale: Locale;
  playOnMobile?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null),
    [paused, setPaused] = useState(true);
  const t = labels[locale];
  useEffect(() => {
    if (
      !matchMedia('(prefers-reduced-motion: reduce)').matches &&
      (playOnMobile || !matchMedia('(max-width: 767px)').matches)
    )
      ref.current
        ?.play()
        .then(() => setPaused(false))
        .catch(() => setPaused(true));
  }, [playOnMobile]);
  return (
    <div
      className={playOnMobile ? 'native-video-media' : 'native-video-media native-desktop-video'}
    >
      <div className="elementor-background-video-container native-background-video">
        <video
          ref={ref}
          src={src}
          className="elementor-background-video-hosted"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
      <button
        type="button"
        className="native-motion-toggle native-video-toggle"
        data-content-control
        data-pagefind-ignore
        aria-label={paused ? t.play : t.pause}
        onClick={() => {
          if (paused)
            ref.current
              ?.play()
              .then(() => setPaused(false))
              .catch(() => setPaused(true));
          else {
            ref.current?.pause();
            setPaused(true);
          }
        }}
      >
        <Glyph kind={paused ? 'play' : 'pause'} />
      </button>
    </div>
  );
}
export function VideoTrigger({
  url,
  locale,
  className,
  children,
  id,
}: {
  url: string;
  locale: Locale;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    [playing, setPlaying] = useState(false);
  const t = labels[locale];
  const dialogId = useId();
  useEffect(() => {
    if (!playing) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [playing]);
  function close() {
    dialog.current?.close();
  }
  return (
    <>
      <button
        ref={trigger}
        id={id}
        type="button"
        className={(className || '') + ' native-video-trigger'}
        aria-label={t.playVideo}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={playing}
        onClick={() => {
          setPlaying(true);
          dialog.current?.showModal();
        }}
      >
        {children}
      </button>
      {
        <dialog
          ref={dialog}
          id={dialogId}
          aria-modal="true"
          className="native-video-dialog"
          aria-label={t.video}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClose={() => {
            setPlaying(false);
            trigger.current?.focus();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            className="native-dialog-close"
            aria-label={t.closeVideo}
            onClick={close}
          >
            <Glyph kind="close" />
          </button>
          {playing && (
            <iframe
              title={t.video}
              src={url}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
        </dialog>
      }
    </>
  );
}

export function TableOfContents({
  className,
  title,
  id,
  items,
  locale,
}: {
  className: string;
  title: string;
  id: string;
  items: { id: string; text: string; level: number }[];
  locale: Locale;
}) {
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const query = matchMedia('(min-width:768px)');
    const update = () => {
      setOpen(query.matches);
      setReady(true);
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const t = labels[locale];
  return (
    <nav
      className={
        className + (open ? '' : ' elementor-toc--collapsed') + (ready ? '' : ' native-toc-initial')
      }
      aria-label={title.trim()}
    >
      <div className="elementor-widget-container">
        <div className="elementor-toc__header">
          <h4 className="elementor-toc__header-title">{title}</h4>
          <button
            type="button"
            className="elementor-toc__toggle-button native-toc-toggle"
            aria-controls={id}
            aria-expanded={open}
            aria-label={open ? t.collapseContents : t.expandContents}
            onClick={() => setOpen(!open)}
          >
            <Glyph kind={open ? 'previous' : 'next'} />
          </button>
        </div>
        <div className="elementor-toc__body" id={id} hidden={!open}>
          <ol className="elementor-toc__list-wrapper" data-content-control data-pagefind-ignore>
            {items.map((item) => (
              <li className="elementor-toc__list-item" key={item.id}>
                <div className="elementor-toc__list-item-text-wrapper">
                  <a className="elementor-toc__list-item-text" href={'#' + item.id}>
                    {item.text}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
}
