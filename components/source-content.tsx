import { AwardNavigation } from './award-navigation';
import Image from 'next/image';
import { youtubeVideoId } from '@/lib/youtube';
import { EmployerTabs } from './employer-tabs';
import { ExternalFrame } from './external-frame';
import { externalLinkAttributes, secureNewTabRel } from '@/lib/external-links';
import { InlineVideo } from './inline-video';
import videoPosters from '@/content/integrations/external-video-posters.json';
import { isLegacyChat } from '@/lib/legacy-ui';
import { createElement, type ReactNode } from 'react';
import type { ContentNode, Locale } from '@/lib/content-schema';
import {
  routes,
  reservedRoutes,
  employersEnabled,
  normalizePath,
  isLinkDisabled,
} from '@/lib/routing';
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
  // Fragment/query-only references resolve against the current document.
  if (href.startsWith('#') || href.startsWith('?')) return href;
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
  if (node.tag === 'iframe') {
    try {
      const url = new URL(node.attrs.src);
      if (
        url.protocol === 'https:' &&
        ['forms.office.com', 'player.vimeo.com'].includes(url.hostname)
      )
        return (
          <ExternalFrame
            key={key}
            src={url.href}
            title={
              node.attrs.title ||
              (url.hostname === 'forms.office.com' ? 'CNAP Application' : 'CNAP video')
            }
          />
        );
    } catch {}
    return null;
  }
  const headingLevel = ctx.headings?.[key] || 0;
  const extra = ctx.layout.nodes[key] || { attrs: {} };
  const raw = extra.attrs;
  const classes = [
    classOf(node)
      .split(/\s+/)
      .filter((c) => c !== 'layzr-bg')
      .join(' '),
    extra.styleClass,
    node.tag === 'img' ? 'is-loaded' : '',
    headingLevel === 1 && node.tag !== 'h1' ? 'native-source-' + node.tag : '',
    headingLevel > 1 && node.tag !== 'h' + headingLevel ? 'semantic-source-' + node.tag : '',
  ]
    .filter(Boolean)
    .join(' ');
  let tag = headingLevel ? 'h' + headingLevel : node.tag;
  const settings = setting(raw);
  const widgetSettings = raw['data-widget_type'] ? settings : ctx.widgetSettings;
  const context = { ...ctx, widgetSettings };
  const isAwards = ctx.layout.bodyClasses.split(/\s+/).includes('page-id-95275');
  const awardCards = ['ae6e84a', 'fc8b74f', 'f7198d0', '6baacc9', 'e4e7e1a', '1b85b90', 'f727979'];
  const children = (inContext = context) => {
    const rendered = node.children.map((child, i) =>
      renderSourceNode(child, key + '.' + i, inContext),
    );
    if (isAwards && raw['data-elementor-id'] === '95275') {
      const start = node.children.findIndex(
        (n) => n.type === 'element' && n.source?.elementorId === 'a9f540c',
      );
      const end =
        node.children.findIndex(
          (n) => n.type === 'element' && n.source?.elementorId === 'f727979',
        ) + 1;
      if (start >= 0 && end > start)
        return [
          ...rendered.slice(0, start),
          <div className="awards-scope" key="awards-scope">
            {rendered.slice(start, end)}
          </div>,
          ...rendered.slice(end),
        ];
    }
    return rendered;
  };
  if (isAwards && node.source?.elementorId === 'a9f540c') {
    const items: { label: string; id: string }[] = [];
    const scan = (n: ContentNode) => {
      if (n.type !== 'element') return;
      if (n.tag === 'a' && n.attrs.href) {
        const url = new URL(n.attrs.href, 'https://yourcnastory.org');
        if (url.hash)
          items.push({ label: texts(n).trim(), id: decodeURIComponent(url.hash.slice(1)) });
      }
      n.children.forEach(scan);
    };
    scan(node);
    return <AwardNavigation key={key} items={items} />;
  }
  if (isAwards && node.tag === 'h6') {
    const paragraph = node.children.findIndex((n) => n.type === 'element' && n.tag === 'p');
    const limit = paragraph < 0 ? node.children.length : paragraph;
    const double = node.children.findIndex((n, i) => {
      const next = node.children[i + 1];
      return (
        i < limit &&
        n.type === 'element' &&
        n.tag === 'br' &&
        next?.type === 'element' &&
        next.tag === 'br'
      );
    });
    const end = double >= 0 ? double : limit;
    const body = paragraph >= 0 ? paragraph : double >= 0 ? double + 2 : limit;
    return (
      <div key={key} className="award-title-group">
        <h2 id={node.attrs.id} className="award-title">
          {node.children.slice(0, end).map((c, i) => renderSourceNode(c, key + '.' + i, context))}
        </h2>
        {body < node.children.length && (
          <div className="award-definitions">
            {node.children
              .slice(body)
              .map((c, i) => renderSourceNode(c, key + '.' + (body + i), context))}
          </div>
        )}
      </div>
    );
  }

  if (ctx.layout.bodyClasses.includes('page-id-96540') && node.source?.elementorId === '9d50f65') {
    const cards: { node: ContentNode; path: string }[] = [];
    let heading: { node: ContentNode; path: string } | undefined;
    const scan = (n: ContentNode, path: string) => {
      if (n.type !== 'element') return;
      if (!heading && /^h[1-6]$/.test(n.tag) && texts(n).trim()) heading = { node: n, path };
      if (has(n, 'wf-cell')) {
        cards.push({ node: n, path });
        return;
      }
      n.children.forEach((c, i) => scan(c, path + '.' + i));
    };
    scan(node, key);
    return (
      <section key={key} id={node.attrs.id} className="cusp-benefits">
        <div className="cusp-benefits-inner">
          {heading && renderSourceNode(heading.node, heading.path, context)}
          <div className="cusp-benefit-grid">
            {cards.map((c) => renderSourceNode(c.node, c.path, context))}
          </div>
        </div>
      </section>
    );
  }
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
  if (has(node, 'the7-e-tabs-wrapper')) {
    const nav = first(node, (n) => has(n, 'the7-e-tabs-nav'));
    const titles =
      nav?.type === 'element' ? nav.children.filter((n) => has(n, 'the7-e-tab-title')) : [];
    return (
      <EmployerTabs
        key={key}
        presentation={
          ctx.layout.bodyClasses.includes('page-id-96540') && titles.length > 3
            ? 'accordion'
            : 'tabs'
        }
        items={titles.flatMap((title) => {
          if (title.type !== 'element') return [];
          const panel = first(
            node,
            (n) => n.type === 'element' && n.attrs.id === title.attrs['aria-controls'],
          );
          if (panel?.type !== 'element') return [];
          const locate = (
            root: ContentNode,
            target: ContentNode,
            path: string,
          ): string | undefined =>
            root === target
              ? path
              : root.type === 'element'
                ? root.children.map((c, i) => locate(c, target, path + '.' + i)).find(Boolean)
                : undefined;
          const panelKey = locate(node, panel, key)!;
          return [
            {
              title: texts(title),
              titleId: title.attrs.id,
              panelId: panel.attrs.id,
              body: panel.children.map((c, i) => renderSourceNode(c, panelKey + '.' + i, context)),
            },
          ];
        })}
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
    const id = youtubeVideoId(String(widgetSettings.youtube_url));
    const poster = videoPosters.find((item) => item.videoId === id);
    if (poster?.mode === 'lightbox')
      return (
        <VideoTrigger
          key={key}
          locale={ctx.locale}
          url={'https://www.youtube.com/embed/' + id + '?rel=0'}
          className="native-video-poster cusp-implementation-video"
        >
          <Image
            src={poster.path}
            alt=""
            width={1280}
            height={720}
            sizes="(max-width: 767px) 100vw, 480px"
          />
          <span className="native-video-play" aria-hidden="true">
            ▶
          </span>
        </VideoTrigger>
      );
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
        label={texts(node).replace(/\s+/g, ' ').trim().slice(0, 120)}
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
  if (isAwards && awardCards.includes(node.source?.elementorId || '')) {
    props['data-award-card'] = true;
    props.tabIndex = -1;
  }
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
  if (/^h[1-6]$/.test(tag) && !texts(node).trim()) tag = 'div';
  if (ctx.headings?.[key] && texts(node).trim()) {
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
    const disabled = isLinkDisabled(
      href,
      gated.has(normalizePath(href.split(/[?#]/)[0])),
      employersEnabled,
    );
    if (disabled) {
      tag = 'span';
      props['aria-disabled'] = true;
      delete props.target;
      delete props.rel;
      delete props.role;
    } else {
      props.href = href;
      Object.assign(props, externalLinkAttributes(href, props.rel as string | undefined));
      if (props.target === '_blank') props.rel = secureNewTabRel(props.rel as string | undefined);
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
