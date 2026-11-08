import { z } from 'zod';
export const localeSchema = z.enum(['en', 'es']);
export const sectionSchema = z.enum(['career-seekers', 'shared', 'employers']);
export const metadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  canonical: z.string(),
  robots: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage: z.string(),
});
export const routeSchema = z.object({
  id: z.string(),
  path: z.string().startsWith('/'),
  locale: localeSchema,
  section: sectionSchema,
  counterpart: z.string().nullable(),
  template: z.string(),
  metadata: metadataSchema.nullable(),
  heading: z.string().nullable(),
  anchors: z.array(z.string()),
});
export type ContentNode =
  | { type: 'text'; value: string }
  | {
      type: 'element';
      tag: string;
      attrs: Record<string, string>;
      children: ContentNode[];
      source?: { elementorId: string; widget: string; classes: string };
    };
export const contentNodeSchema: z.ZodType<ContentNode> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.object({ type: z.literal('text'), value: z.string() }),
    z.object({
      type: z.literal('element'),
      tag: z.string().regex(/^[a-z][a-z0-9-]*$/),
      attrs: z.record(z.string(), z.string()),
      children: z.array(contentNodeSchema),
      source: z
        .object({ elementorId: z.string(), widget: z.string(), classes: z.string() })
        .optional(),
    }),
  ]),
);
export const contentBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('document'), nodes: z.array(contentNodeSchema) }),
  z.object({ type: z.literal('mdx'), source: z.string() }),
  z.object({
    type: z.literal('image'),
    src: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  z.object({ type: z.literal('embed'), src: z.url(), title: z.string() }),
]);
export const pageSchema = z.object({
  routeId: z.string(),
  locale: localeSchema,
  metadata: metadataSchema,
  blocks: z.array(contentBlockSchema),
});
export const careerPathSchema = pageSchema.extend({
  kind: z.literal('careerpath'),
  collectionOrder: z.number().int(),
});
export const testimonialSchema = z.object({
  id: z.string(),
  locale: localeSchema,
  quote: z.string(),
  attribution: z.string(),
  image: z.string().optional(),
});
const navItemSchema = z.object({ label: z.string(), href: z.string(), employer: z.boolean() });
export interface MobileNode {
  label: string;
  href: string | null;
  employer: boolean;
  children: MobileNode[];
}
const mobileNodeSchema: z.ZodType<MobileNode> = z.lazy(() =>
  z.object({
    label: z.string(),
    href: z.string().nullable(),
    employer: z.boolean(),
    children: z.array(mobileNodeSchema),
  }),
);
export const globalSettingsSchema = z.object({
  locale: localeSchema,
  sourceUrl: z.url(),
  nav: z.array(
    navItemSchema.extend({
      columns: z.array(z.object({ title: z.string(), items: z.array(navItemSchema) })),
    }),
  ),
  mobile: z.array(mobileNodeSchema),
  announcement: z
    .object({ enabled: z.boolean(), text: z.string(), linkLabel: z.string(), href: z.string() })
    .nullable(),
  footer: z.object({
    description: z.string(),
    columns: z.array(
      z.object({
        title: z.string(),
        href: z.string(),
        employer: z.boolean(),
        items: z.array(navItemSchema),
      }),
    ),
    copyright: z.string(),
    copyrightLinkLabel: z.string(),
    policy: z.object({ label: z.string(), href: z.string() }),
    foundationHref: z.url(),
    logoAlt: z.string(),
  }),
  ui: z.object({
    menu: z.string(),
    closeMenu: z.string(),
    openMenu: z.string(),
    navigation: z.string(),
    languages: z.string(),
    search: z.string(),
    skip: z.string(),
    top: z.string(),
  }),
});
export type Locale = z.infer<typeof localeSchema>;
export type RouteRecord = z.infer<typeof routeSchema>;
export type PageContent = z.infer<typeof pageSchema>;
