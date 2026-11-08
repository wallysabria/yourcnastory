'use client';
import { useEffect, useRef, useState } from 'react';
import labels from '@/content/ui/widgets.json';
import type { Locale } from '@/lib/content-schema';
export function InlineVideo({
  src,
  poster,
  locale,
}: {
  src: string;
  poster: string;
  locale: Locale;
}) {
  const [active, setActive] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (active) frame.current?.focus();
  }, [active]);
  return active ? (
    <iframe
      ref={frame}
      tabIndex={0}
      className="native-inline-video"
      title={labels[locale].video}
      src={src}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  ) : (
    <button
      type="button"
      className="native-video-poster"
      aria-label={labels[locale].playVideo}
      onClick={() => setActive(true)}
    >
      {/* Original provider thumbnail is self-hosted to avoid passive third-party requests. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- Preserve the original video poster and aspect ratio. */}
      <img src={poster} alt="" loading="lazy" decoding="async" />
      <span className="native-video-play" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="m8 4 12 8-12 8Z" />
        </svg>
      </span>
    </button>
  );
}
