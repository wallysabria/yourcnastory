import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  trailingSlash: true,
  // Vercel's adapter infers slash-aware static routing from Next's redirect.
  // Its edge rules override the 308 with our data-driven 301; locally proxy handles it.
  skipTrailingSlashRedirect: process.env.VERCEL !== '1',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers:
          process.env.VERCEL_ENV === 'production' && process.env.SITE_LAUNCH_APPROVED === 'true'
            ? []
            : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
  },
};
export default nextConfig;
