import { InlineVideo } from './inline-video';
import videoPosters from '@/content/integrations/external-video-posters.json';
import { isLegacyChat } from '@/lib/legacy-ui';
import { createElement, type ReactNode } from 'react';
import type { ContentNode, Locale } from '@/lib/content-schema';
import { routes, reservedRoutes, employersEnabled, normalizePath } from '@/lib/routing';
import {
  AccordionItem,
  Carousel,
  BackgroundVideo,
  VideoTrigger,
  TableOfContents,
} from './content-widgets';
import { SignupForm, CountryCode } from './signup-form';
import mediaSource from '@/content/media/manifest.json' with { type: 'json' };
export type NodeLayout = {
  attrs: Record<string, string>;
  styleClass?: string;
  vectors?: { src: string; attrs: Record<string, string> }[];
};
export type PageLayout = {
  bodyClasses: string;
  template: string;
  styles: string[];
  nodes: Record<string, NodeLayout>;
};
type Context = {
  locale: Locale;
  layout: PageLayout;
  widgetSettings?: Record<string, unknown>;
  inTitle?: boolean;
  inLanguageGroup?: boolean;
  languageOption?: string;
  headings?: Record<string, number>;
  toc?: { key: string; id: string; text: string; level: number }[];
};
const media = new Map(mediaSource.map((r) => [r.url, r.path]));
const gated = new Set(
  [...routes, ...reservedRoutes].filter((r) => r.section === 'employers').map((r) => r.path),
);
export function localAsset(src: string) {
  try {
    const url = new URL(src, 'https://yourcnastory.org');
    return media.get(url.href) || src;
  } catch {
    return src;
  }
}
const classOf = (n: ContentNode) => (n.type === 'element' ? n.source?.classes || '' : '');
const has = (n: ContentNode, c: string) => classOf(n).split(/\s+/).includes(c);
const texts = (n: ContentNode): string =>
  n.type === 'text' ? n.value : n.children.map(texts).join('');
function first(n: ContentNode, predicate: (node: ContentNode) => boolean): ContentNode | undefined {
  if (predicate(n)) return n;
  if (n.type === 'element')
    for (const c of n.children) {
      const found = first(c, predicate);
      if (found) return found;
    }
}
function setting(attrs: Record<string, string>) {
  try {
    return JSON.parse(attrs['data-settings'] || '{}');
  } catch {
    return {};
  }
}
function destination(href: string) {
  try {
    const url = new URL(href, 'https://yourcnastory.org');
    return ['yourcnastory.org', 'www.yourcnastory.org'].includes(url.hostname)
      ? url.pathname + url.search + url.hash
      : href;
  } catch {
    return href;
  }
}
const tagNames = new Set(
  'div span p h1 h2 h3 h4 h5 h6 a strong em b i u s small sub sup blockquote q cite ul ol li dl dt dd table caption thead tbody tfoot tr th td figure figcaption img picture source br hr section article aside details summary form label input select option textarea fieldset legend video audio'.split(
    ' ',
  ),
);
export function renderSourceNode(node: ContentNode, key: string, ctx: Context): ReactNode {
  if (node.type === 'text') return node.value;
  if (isLegacyChat(node)) return null;
  const extra = ctx.layout.nodes[key] || { attrs: {} };
  const raw = extra.attrs;
  const classes = [
    classOf(node)
      .split(/\s+/)
      .filter((c) => c !== 'layzr-bg')
      .join(' '),
    extra.styleClass,
    node.tag === 'img' ? 'is-loaded' : '',
    ctx.headings?.[key] === 1 && node.tag !== 'h1' ? 'native-source-' + node.tag : '',
  ]
    .filter(Boolean)
    .join(' ');
  let tag = ctx.headings?.[key] === 1 ? 'h1' : node.tag;
  const settings = setting(raw);
  const widgetSettings = raw['data-widget_type'] ? settings : ctx.widgetSettings;
  const context = { ...ctx, widgetSettings };
  const children = (inContext = context) =>
    node.children.map((child, i) => renderSourceNode(child, key + '.' + i, inContext));
  if (!tagNames.has(tag)) return children();
  if (raw['data-widget_type'] === 'table-of-contents.default') {
    const title = first(node, (n) => n.type === 'element' && has(n, 'elementor-toc__header-title'));
    const body = first(node, (n) => n.type === 'element' && has(n, 'elementor-toc__body'));
    return (
      <TableOfContents
        key={key}
        className={classes}
        title={title ? texts(title) : ''}
        id={body?.type === 'element' ? body.attrs.id : 'page-toc'}
        items={ctx.toc || []}
        locale={ctx.locale}
      />
    );
  }
  if (has(node, 'elementor-background-video-container')) return null;
  if (tag === 'img' && raw['data-uuid'])
    return (
      <InlineVideo
        key={key}
        locale={ctx.locale}
        src={'https://play.vidyard.com/' + encodeURIComponent(raw['data-uuid']) + '.html'}
        poster={localAsset(
          node.attrs.src || 'https://play.vidyard.com/' + raw['data-uuid'] + '.jpg',
        )}
      />
    );
  if (has(node, 'elementor-video') && widgetSettings?.video_type === 'youtube') {
    const id = new URL(String(widgetSettings.youtube_url)).pathname.split('/').pop();
    const poster = videoPosters.find((item) => item.videoId === id);
    if (poster)
      return (
        <InlineVideo
          key={key}
          locale={ctx.locale}
          src={'https://www.youtube.com/embed/' + id}
          poster={poster.path}
        />
      );
    return null;
  }
  if (tag === 'form')
    return (
      <SignupForm key={key} locale={ctx.locale}>
        {children()}
      </SignupForm>
    );
  if (has(node, 'elementor-accordion-item')) {
    const title = node.children.find((c) => has(c, 'elementor-tab-title')),
      panel = node.children.find((c) => has(c, 'elementor-tab-content'));
    if (title?.type === 'element' && panel?.type === 'element')
      return (
        <AccordionItem
          key={key}
          className={classes}
          titleId={title.attrs.id}
          panelId={panel.attrs.id}
          title={title.children.map((n, i) =>
            renderSourceNode(n, key + '.' + node.children.indexOf(title) + '.' + i, {
              ...context,
              inTitle: true,
            }),
          )}
        >
          {panel.children.map((n, i) =>
            renderSourceNode(n, key + '.' + node.children.indexOf(panel) + '.' + i, context),
          )}
        </AccordionItem>
      );
  }
  if (has(node, 'owl-carousel')) {
    const config = ctx.widgetSettings || {};
    return (
      <Carousel
        key={key}
        className={classes}
        locale={ctx.locale}
        columns={Number(config.widget_columns) || 3}
        tablet={Number(config.widget_columns_tablet) || 2}
        mobile={Number(config.widget_columns_mobile) || 1}
        gap={Number((config.gap_between_posts as { size?: number })?.size) || 20}
        autoplay={raw['data-autoplay'] === 'true'}
        interval={Number(raw['data-autoplay_speed']) || 6000}
      >
        {node.children
          .map((child, i) => renderSourceNode(child, key + '.' + i, context))
          .filter((n, i) => node.children[i].type !== 'text' || texts(node.children[i]).trim())}
      </Carousel>
    );
  }
  const props: Record<string, unknown> = { key, className: classes || undefined };
  for (const [name, value] of Object.entries(node.attrs)) {
    if (['src', 'srcset', 'href', 'value', 'role'].includes(name)) continue;
    const names: Record<string, string> = {
      for: 'htmlFor',
      colspan: 'colSpan',
      rowspan: 'rowSpan',
    };
    props[names[name] || name] = value;
  }
  for (const name of [
    'data-id',
    'data-elementor-type',
    'data-elementor-id',
    'data-element_type',
    'data-widget_type',
    'data-tab',
  ])
    if (raw[name]) props[name] = raw[name];
  if (node.attrs.role) props.role = node.attrs.role;
  if (node.attrs.id === 'content') props.tabIndex = -1;
  if (has(node, 'e-loop-item')) props.role = 'listitem';
  const tocItem = ctx.toc?.find((item) => item.key === key);
  if (tocItem && !props.id) props.id = tocItem.id;
  if (has(node, 'elementor-flip-box')) {
    props.tabIndex = 0;
    props.role = 'group';
  }
  if ((tag === 'div' || tag === 'span' || (tag === 'a' && !node.attrs.href)) && !props.role)
    delete props['aria-label'];
  if (ctx.headings?.[key]) {
    props.role = 'heading';
    props['aria-level'] = ctx.headings[key];
  }
  if (
    has(node, 'input-group') &&
    first(node, (n) => n.type === 'element' && n.attrs.name === 'MMERGE3')
  ) {
    tag = 'fieldset';
    props.className = classes + ' native-language-group';
    context.inLanguageGroup = true;
  }
  let option = ctx.languageOption;
  if (tag === 'li') {
    const radio = first(node, (n) => n.type === 'element' && n.attrs.name === 'MMERGE3');
    if (radio?.type === 'element') {
      option = radio.attrs.value;
      if (!['English', 'Español'].includes(option)) return null;
      context.languageOption = option;
    }
  }
  if (tag === 'strong' && ctx.inLanguageGroup) tag = 'legend';
  if (ctx.inTitle && tag === 'a') {
    tag = 'span';
    delete props.role;
  }
  let output = children(context);
  if (tag === 'label' && option) output = [option === 'Español' ? 'Español' : 'English'];
  if (tag === 'input') {
    if (node.attrs.name?.startsWith('b_')) {
      props.name = 'website';
      props.tabIndex = -1;
      props.autoComplete = 'off';
      props['aria-hidden'] = true;
    }
    props.defaultValue = node.attrs.value || '';
    if (node.attrs.name === 'MMERGE3') {
      delete props.defaultValue;
      props.value = node.attrs.value;
    }
    if (['FNAME', 'LNAME', 'MMERGE4', 'EMAIL', 'MMERGE3'].includes(node.attrs.name))
      props.required = true;
    if (node.attrs.name === 'MMERGE4') {
      props.inputMode = 'numeric';
      props.autoComplete = 'postal-code';
    }
    if (node.attrs.name === 'EMAIL') props.autoComplete = 'email';
    if (node.attrs.name === 'FNAME') props.autoComplete = 'given-name';
    if (node.attrs.name === 'LNAME') props.autoComplete = 'family-name';
    if (node.attrs.name === 'SMSPHONE') {
      props.type = 'tel';
      props.autoComplete = 'tel-national';
    }
  }
  if (tag === 'img' || tag === 'source') {
    if (node.attrs.src) props.src = localAsset(node.attrs.src);
    if (node.attrs.srcset)
      props.srcSet = node.attrs.srcset
        .split(',')
        .map((entry) => {
          const [url, size] = entry.trim().split(/\s+/);
          return localAsset(url) + (size ? ' ' + size : '');
        })
        .join(',');
    if (tag === 'img') {
      props.loading = raw['data-src'] ? 'lazy' : 'eager';
      props.decoding = 'async';
      props.alt = node.attrs.alt || '';
    }
  }
  if (tag === 'a' && node.attrs.href) {
    if (node.attrs.href.includes('elementor-action')) {
      try {
        const config = JSON.parse(
          Buffer.from(
            decodeURIComponent(node.attrs.href).split('settings=')[1] || '',
            'base64',
          ).toString(),
        );
        const url = new URL(config.url);
        if (url.protocol === 'https:')
          return (
            <VideoTrigger
              key={key}
              locale={ctx.locale}
              url={url.href}
              className={classes}
              id={node.attrs.id}
            >
              {output}
            </VideoTrigger>
          );
      } catch {
        /* Non-video actions remain unchanged. */
      }
    }
    const href = destination(node.attrs.href);
    const disabled = !employersEnabled && gated.has(normalizePath(href.split(/[?#]/)[0]));
    if (disabled) {
      tag = 'span';
      props['aria-disabled'] = true;
      delete props.target;
      delete props.rel;
      delete props.role;
    } else {
      props.href = href;
      if (props.target === '_blank') props.rel = 'noopener noreferrer';
      if (
        !texts(node).trim() &&
        !first(node, (n) => n.type === 'element' && n.tag === 'img' && Boolean(n.attrs.alt)) &&
        !props['aria-label']
      ) {
        try {
          props['aria-label'] =
            routes.find((r) => r.path === new URL(href, 'https://yourcnastory.org').pathname)
              ?.heading || new URL(href, 'https://yourcnastory.org').hostname;
        } catch {
          /* No navigable URL. */
        }
      }
    }
  }
  if (extra.vectors)
    output.push(
      ...extra.vectors.map((vector, i) =>
        createElement(
          'svg',
          {
            key: 'vector' + i,
            viewBox: vector.attrs.viewBox || '0 0 24 24',
            className: vector.attrs.class || 'native-source-vector',
            'aria-hidden': true,
            focusable: false,
          },
          createElement('image', { href: vector.src, width: '100%', height: '100%' }),
        ),
      ),
    );
  if (settings.background_video_link) {
    const src = localAsset(settings.background_video_link);
    output.unshift(
      <BackgroundVideo
        key="background"
        src={src}
        locale={ctx.locale}
        playOnMobile={Boolean(settings.background_play_on_mobile)}
      />,
    );
  }
  const isVoid = ['img', 'input', 'source', 'br', 'hr'].includes(tag);
  const rendered = createElement(tag, props, ...(isVoid ? [] : output));
  if (tag === 'input' && node.attrs.name === 'SMSPHONE')
    return (
      <span className="native-phone-inputs" key={key}>
        <CountryCode locale={ctx.locale} />
        {rendered}
      </span>
    );
  return rendered;
}
