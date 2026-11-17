'use client';
import { useState } from 'react';
import labels from '@/content/ui/external-frame.json';
export function ExternalFrame({ src, title }: { src: string; title: string }) {
  const [active, setActive] = useState(false);
  const form = new URL(src).hostname === 'forms.office.com';
  return active ? (
    <iframe
      className={'employer-frame ' + (form ? 'employer-form-frame' : 'employer-video-frame')}
      src={src}
      title={title}
      loading="lazy"
      allow={form ? undefined : 'fullscreen; picture-in-picture'}
      allowFullScreen={!form}
    />
  ) : (
    <div className="employer-frame-placeholder">
      <p>{title}</p>
      <p>{labels.note}</p>
      <button type="button" onClick={() => setActive(true)}>
        {form ? labels.form : labels.video}
      </button>
    </div>
  );
}
