import type { MetadataRoute } from 'next';
import { isIndexable } from '@/lib/metadata';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: isIndexable ? [] : ['/'] } };
}
