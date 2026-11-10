/** Page navigation only: production/review aliases remain internal; mail/tel are untouched. */
export function isExternalPageLink(href: string | null | undefined): boolean {
  if (!href) return false;
  try {
    const url = new URL(href, 'https://yourcnastory.org');
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      !['yourcnastory.org', 'www.yourcnastory.org', 'yourcnastory.vercel.app'].includes(
        url.hostname,
      )
    );
  } catch {
    return false;
  }
}
export function secureNewTabRel(rel: string = ''): string {
  return [...new Set([...rel.split(/\s+/).filter(Boolean), 'noopener', 'noreferrer'])].join(' ');
}
export function externalLinkAttributes(href: string | null | undefined, rel?: string) {
  return isExternalPageLink(href) ? { target: '_blank' as const, rel: secureNewTabRel(rel) } : {};
}
