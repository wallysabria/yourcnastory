import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // The Vercel Next adapter infers static route shape from a 308 /$1/ rule.
  // Restrict this build-time hint to a reserved, non-serving host. Actual requests
  // use the explicit 301 data in vercel.json/proxy, never this hint.
  async redirects() {
    return [
      {
        source: '/:path+',
        destination: '/:path/',
        statusCode: 308,
        has: [{ type: 'host' as const, value: 'routing-shape.invalid' }],
      },
    ];
  },
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
