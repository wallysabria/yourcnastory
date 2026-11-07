import { contentAt } from '@/lib/content-pages';
import { reviewNode, htmlEscape } from '@/lib/content-review';
export function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path') || '/';
  const page = contentAt(path);
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Content-Security-Policy':
      "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'",
    'Cache-Control': 'no-store',
  };
  if (!page) return new Response('Content record not found', { status: 404, headers });
  const body = page.blocks
    .flatMap((block) => (block.type === 'document' ? block.nodes.map(reviewNode) : []))
    .join('');
  return new Response(
    '<!doctype html><html lang="' +
      page.locale +
      '"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Content verification — ' +
      htmlEscape(path) +
      '</title><style>body{font:16px/1.6 system-ui;max-width:1000px;margin:24px auto;padding:0 20px}img{max-width:100%;height:auto}fieldset{border:1px solid #ddd}a{color:#005c71}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:8px}.notice{padding:16px;background:#fff4cf}</style><aside class="notice">Phase 3 content verification only. This is not the final page template. Links, forms and embeds are inert.</aside>' +
      body +
      '</html>',
    { headers },
  );
}
