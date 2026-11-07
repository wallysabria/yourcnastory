import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
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
