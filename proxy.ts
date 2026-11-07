import { NextResponse, type NextRequest } from 'next/server';
import { redirectDestination } from './lib/redirects';
export function proxy(request: NextRequest) {
  const target = redirectDestination(request.nextUrl.pathname);
  const response = target
    ? NextResponse.redirect(new URL(target + request.nextUrl.search, request.url), 301)
    : NextResponse.next();
  if (process.env.VERCEL_ENV !== 'production' || process.env.SITE_LAUNCH_APPROVED !== 'true')
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}
export const config = {
  matcher: ['/((?!api|_next|images/|fonts/|wp-content/|favicon.ico|robots.txt).*)'],
};
