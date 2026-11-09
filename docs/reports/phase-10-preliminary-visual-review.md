# Visual review — preliminary QA

96 desktop/mobile comparisons against original Phase 1 JPEG references were run. All 96 exceeded the diagnostic 0.5% changed-pixel threshold. A second 96-view capture against the current WordPress source was completed, preserving the same stabilization method as the earlier audit. No full-site pixel-parity pass is claimed.

The joined prior/current diagnostic results are in phase-10-preliminary-visual-triage.json. Original Phase 1 references, prior Phase 4 differences and new preliminary captures are distinct evidence; the Phase 7 heading-only comparison is not a full-page parity certificate.

Manually inspected full-page source/native samples (source left, migration right):

- Homepage desktop: hero video/frame state differs. Source capture has blank animated partner/testimonial areas and less populated footer groups while the migration shows content. The approved consent banner/privacy footer link and gated Employer controls also differ. These account for visible portions of the comparison but do not prove every flagged pixel is approved.
- Career FAQ desktop: title and accordion are visibly similar, while the approved native signup/retired-language controls and consent UI differ. Source animated Quick Links/footer content is absent in the capture but visible in the migration, causing substantial height differences. No source text was rewritten to reduce the difference.

Samples: phase-10-preliminary-visual-samples/home.png and frequently-asked-questions.png. These contain no submitted form data. Full-resolution source/native captures remain ignored under _source/phase-10-preliminary/stabilized/.

Remaining visual differences require owner/design review before a whole-site parity sign-off. Source animation behavior, image timing, reduced-motion fallback and original form differences make these raw full-page ratios unsuitable as an automatic acceptance score. No unapproved redesign or source-hiding production change was made.
