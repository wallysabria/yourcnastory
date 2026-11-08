import { indexableRoutes } from '@/lib/seo';
import { origin } from '@/lib/metadata';
export const dynamic = 'force-static';
export function GET() {
  const clean = (value: string) => value.replace(/[\[\]\r\n]/g, ' ');
  const lines = [
    '# Your CNA Story',
    '',
    '> Certified Nurse Assistant Program (CNAP), Quality Care Health Foundation.',
    '',
    'Career Seekers resources about CNA careers and long-term care in California. English and Spanish pages are listed below. Follow the linked pages for their published content; this directory does not replace them.',
    '',
    '## English',
  ];
  for (const locale of ['en', 'es']) {
    if (locale === 'es') lines.push('', '## Español');
    for (const route of indexableRoutes().filter(
      (r) => r.locale === locale && r.section === 'career-seekers',
    ))
      lines.push(
        '- [' +
          clean(route.heading || route.metadata?.title || route.path) +
          '](' +
          origin +
          route.path +
          ')',
      );
  }
  lines.push('', '## Shared pages');
  for (const route of indexableRoutes().filter((r) => r.section === 'shared'))
    lines.push(
      '- [' +
        clean(route.heading || route.metadata?.title || route.path) +
        '](' +
        origin +
        route.path +
        ')',
    );
  return new Response(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
