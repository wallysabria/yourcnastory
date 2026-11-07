# Design reference — observed, not a redesign

Source: public HTML/CSS plus rendered computed styles. Full evidence is in `browser-evidence.json`, `design-css-evidence.json` and `font-face-evidence.json`. Screenshots are indexed in `screenshots-index.json`; image binaries stay local/ignored under `docs/audit/screenshots/`.

## Typography and colors

- Primary rendered family: Manrope, sans-serif. Form controls also use Helvetica/Arial. Font-face URLs/weights are recorded in the evidence; brand font licensing files have not been supplied, so licensing/permission to self-host is unverified.
- Career Seekers desktop H1 sample: approximately 53.85px, weight 600, 70.01px line height at 1440px viewport. H2/H3 section sample: approximately 29.90px / 41.86px, weight 600. Eyebrow sample: 18px / 25.2px, weight 700. Responsive/fluid sizes must follow source CSS, not these rounded snapshots alone.
- Repeated accents: blue rgb(1,89,211) (#0159D3), cyan rgb(11,196,217) (#0BC4D9), dark text rgb(44,51,56) (#2C3338), white; dark photographic hero overlay. Full colors and element-specific spacing/borders are in computed samples.
- Buttons use rounded/pill styling; preserve filled versus outline hierarchy, hover/focus behavior subject to accessibility approval. Font Awesome and inline SVG icons are present. No new icon set selected.

## Layout and behavior

- Desktop horizontal logo/navigation with audience mega menus, language selector and search trigger. Header is overlaid on hero photography/video where shown; page-specific transparent/solid treatments must be preserved.
- Mobile 390px uses hamburger/logo/search; popup menu with nested expansion, separate from desktop menus. Footer columns stack; signup overflow is an already-approved fix.
- Career landing uses photo/video hero, journey cards, content blocks, career carousel, signup and quick links. Career entries share a template; resources retain deep-linked sections; FAQ accordions require independent open-state reference when implemented.
- Homepage partner and testimonial carousels, video/hero media, employer blocks and CTA are preserved. Employer controls are disabled only in the replacement before its gate; source remains unchanged.
- Announcement observed at runtime: November event announcement with an external Learn more link. Its exact copy/placement must be captured from current approved source when ported; it can change over time.
- Skip link and back-to-top exist. Chat launcher/pre-chat bubble appears on Career Seekers pages. Search opens popup 52154. No interaction redesign approved.

## CSS media queries observed

- `screen and (max-width: 782px)`
- `(prefers-reduced-motion: reduce)`
- `screen and (max-height: 700px)`
- `screen and (max-height: 550px)`
- `(max-width: 550px)`
- `screen and (max-width: 600px)`
- `(pointer: coarse)`
- `(max-width: 1024px)`
- `(max-width: 767px)`
- `(min-width:-1)`
- `(max-width:-1)`
- `(min-width: 768px)`
- `(max-width: 479px)`
- `(min-width: 768px) and (max-width: 1024px)`
- `(min-width: 1025px) and (max-width:-1)`
- `(min-width:-1) and (max-width:-1)`
- `(min-width:-1) and (max-width: 1024px)`
- `(min-width: 768px) and (max-width:-1)`
- `(min-width: 1025px)`
- `(prefers-reduced-motion: no-preference)`
- `screen and (max-width: 1024px)`
- `screen and (max-width: 767px)`
- `(min-width: 1025px) and (max-width: 99999px)`
- `(max-width: 1024px) and (min-width: 768px)`
- `screen and (min-width: 1301px)`
- `screen and (min-width: 1026px)`
- `screen and (min-width: 768px) and (max-width: 1024px)`
- `only screen and (min-width: 768px) and (max-width: 991px)`
- `only screen and (max-width: 767px)`
- `(-webkit-min-device-pixel-ratio: 1.1), (-webkit-min-device-pixel-ratio: 1.09375), (min-resolution: 105dpi), (min-resolution: 1.1dppx)`
- `(max-width: 500px)`
- `only screen and (min-width: 961px)`
- `(-ms-high-contrast:none)`
- `screen and (-ms-high-contrast:active), (-ms-high-contrast:none)`
- `(-ms-high-contrast:none), (-ms-high-contrast:active)`
- `only screen and (min-width: 768px)`
- `only screen and (min-width: 1168px)`
- `only screen and (max-width: 768px)`
- `(max-width: 782px)`
- `screen and (max-width: 300px)`
- `screen and (min-width: 1151px)`
- `screen and (max-width: 0px)`
- `screen and (min-width: 778px)`
- `screen and (max-width: 778px)`
- `screen and (max-width: 1150px)`
- `screen and (min-width: 601px) and (max-width: 1150px)`
- `screen and (min-width: 800px)`
- `screen and (max-width: 768px)`
- `screen and (max-width: 992px)`
- `screen and (max-width: 990px)`
- `screen and (min-width: 992px)`
- `screen and (max-width: 640px)`
- `screen and (max-width: 1200px)`
- `screen and (max-width: 1100px)`
- `screen and (max-width: 970px)`
- `only screen and (max-width: 960px)`
- `screen and (max-width: 800px)`
- `screen and (min-width: 0px) and (max-width: 760px)`
- `screen and (max-width: 760px)`
- `screen and (max-width: 568px)`
- `(max-width: 600px)`
- `(max-width: 480px)`
- `screen and (max-width: 500px)`
- `screen and (max-width: 450px)`
- `only screen and (min-width: 768px) and (max-width: 1024px)`
- `screen and (max-width: 760px), screen and (max-height: 300px)`
- `(min-width: 768px) and (max-width: 991px)`
- `(min-width: 992px) and (max-width: 1199px)`
- `screen and (max-width: 320px)`
- `(max-width: 680px)`
- `screen and (max-height: 1024px)`
- `screen and (max-height: 640px)`

## Reference limits

Initial full-page screenshots at 1440×1000 and 390×844 browser viewports capture the initial rendered document. Video frames, carousels, animation, lazy loading and third-party widgets are nondeterministic. Use scroll-loaded detail references for media-heavy pages; this initial set is not a pixel-diff pass or a WCAG certification. No font licence assumptions are made.
