import en from '@/content/global/en.json' with { type: 'json' };
import es from '@/content/global/es.json' with { type: 'json' };
import { globalSettingsSchema, type Locale } from './content-schema';
export interface NavItem {
  nested?: boolean;
  label: string;
  href: string;
  employer: boolean;
}
export interface MenuGroup {
  label: string;
  href: string;
  employer: boolean;
  columns: { title: string; items: NavItem[] }[];
}
export interface MobileItem {
  label: string;
  href: string | null;
  employer: boolean;
  children: MobileItem[];
}
export interface GlobalContent {
  locale: string;
  sourceUrl: string;
  nav: MenuGroup[];
  mobile: MobileItem[];
  announcement: { enabled: boolean; text: string; linkLabel: string; href: string } | null;
  footer: {
    description: string;
    columns: { title: string; href: string; employer: boolean; items: NavItem[] }[];
    copyright: string;
    copyrightLinkLabel: string;
    policy: { label: string; href: string };
    foundationHref: string;
    logoAlt: string;
  };
  ui: {
    menu: string;
    closeMenu: string;
    openMenu: string;
    navigation: string;
    languages: string;
    search: string;
    skip: string;
    top: string;
  };
}
export function globalContent(locale: Locale): GlobalContent {
  const content = globalSettingsSchema.parse(locale === 'es' ? es : en);
  const employer = globalSettingsSchema.parse(en).nav.find((group) => group.employer)!;
  if (locale === 'es')
    content.nav = content.nav.map((group) =>
      group.employer ? { ...group, href: employer.href, columns: employer.columns } : group,
    );
  content.mobile = content.mobile.map((item) =>
    item.employer
      ? {
          ...item,
          href: employer.href,
          children: employer.columns.map((column) => ({
            label: column.title,
            href: null,
            employer: true,
            children: column.items.map((link) => ({ ...link, children: [] })),
          })),
        }
      : item,
  );
  return content;
}
