import { createHash } from 'node:crypto';
import { submitSignup } from '@/lib/signup';
const attempts = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))
    return Response.json({ code: 'invalid', fields: [] }, { status: 415, headers });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ code: 'invalid', fields: [] }, { status: 403, headers });
  if (Number(request.headers.get('content-length')) > 8192)
    return Response.json({ code: 'invalid', fields: [] }, { status: 413, headers });
  const key = createHash('sha256')
    .update(request.headers.get('x-real-ip') || 'local')
    .digest('hex');
  const now = Date.now();
  let entry = attempts.get(key);
  if (!entry || entry.until < now) {
    entry = { count: 0, until: now + 600000 };
    attempts.set(key, entry);
  }
  entry.count++;
  if (attempts.size > 10000) attempts.delete(attempts.keys().next().value!);
  if (entry.count > 6)
    return Response.json(
      { code: 'limited', fields: [] },
      { status: 429, headers: { ...headers, 'Retry-After': '600' } },
    );
  try {
    const text = await request.text();
    if (text.length > 8192)
      return Response.json({ code: 'invalid', fields: [] }, { status: 413, headers });
    const result = await submitSignup(JSON.parse(text));
    return Response.json(result.body, { status: result.status, headers });
  } catch {
    return Response.json({ code: 'invalid', fields: [] }, { status: 400, headers });
  }
}
