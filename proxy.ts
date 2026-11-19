import { NextResponse, type NextRequest } from 'next/server';
import { redirectDestination } from './lib/redirects';
export function proxy(request: NextRequest) {
  const target = redirectDestination(request.nextUrl.pathname);
  const destination = target ? new URL(target, request.url) : null;
  // Preserve queries before the fragment; concatenation would corrupt deep-link hashes.
  if (destination) destination.search = request.nextUrl.search;
  const response = destination ? NextResponse.redirect(destination, 301) : NextResponse.next();
  if (
    request.nextUrl.searchParams.has('s') ||
    process.env.VERCEL_ENV !== 'production' ||
    process.env.SITE_LAUNCH_APPROVED !== 'true'
  )
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}
export const config = {
  matcher: ['/((?!api|_next|images/|fonts/|wp-content/|favicon.ico|robots.txt).*)'],
};
