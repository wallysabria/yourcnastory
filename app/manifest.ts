import type { MetadataRoute } from 'next';
import icons from '@/content/brand/icons.json';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Your CNA Story',
    short_name: 'CNAP',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: icons.themeColor,
    icons: [
      {
        src: '/images/icons/app-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
