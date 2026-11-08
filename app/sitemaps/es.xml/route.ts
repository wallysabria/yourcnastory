import { languageSitemap, xmlResponse } from '@/lib/seo';
export const dynamic = 'force-static';
export function GET() {
  return xmlResponse(languageSitemap('es'));
}
