import type { ContentNode } from './content-schema';
import sourceMedia from '../content/media/manifest.json' with { type: 'json' };
const media = new Map(sourceMedia.map((row) => [row.url, row.path]));
const safeTags = new Set(
  'div span p h1 h2 h3 h4 h5 h6 strong em b i u s small sub sup blockquote q cite ul ol li dl dt dd table caption thead tbody tfoot tr th td figure figcaption img picture source br hr section article aside details summary label input select option textarea fieldset legend a button form video audio iframe'.split(
    ' ',
  ),
);
const voidTags = new Set(['img', 'source', 'input', 'br', 'hr']);
export const htmlEscape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const asset = (value: string) => {
  try {
    return media.get(new URL(value, 'https://yourcnastory.org').href) || '';
  } catch {
    return '';
  }
};
export function reviewNode(node: ContentNode): string {
  if (node.type === 'text') return htmlEscape(node.value);
  if (!safeTags.has(node.tag)) return node.children.map(reviewNode).join('');
  if (['iframe', 'video', 'audio'].includes(node.tag))
    return '<div data-review-embed="' + htmlEscape(node.attrs.src || node.tag) + '"></div>';
  let tag = node.tag;
  if (tag === 'form') tag = 'fieldset';
  if (tag === 'button') tag = 'span';
  const attrs: Record<string, string> = {};
  for (const [key, value] of Object.entries(node.attrs)) {
    if (key === 'href') {
      attrs['data-source-href'] = value;
      continue;
    }
    if (
      [
        'id',
        'alt',
        'title',
        'width',
        'height',
        'colspan',
        'rowspan',
        'scope',
        'type',
        'name',
        'value',
        'placeholder',
        'for',
        'lang',
      ].includes(key)
    )
      attrs[key] = value;
  }
  if (node.tag === 'img' || node.tag === 'source') {
    const src = asset(node.attrs.src || '');
    if (src) attrs.src = src;
    if (node.attrs.srcset)
      attrs.srcset = node.attrs.srcset
        .split(',')
        .map((entry) => {
          const [url, size] = entry.trim().split(/\s+/);
          const local = asset(url);
          return local ? local + (size ? ' ' + size : '') : '';
        })
        .filter(Boolean)
        .join(',');
  }
  if (['input', 'select', 'textarea', 'fieldset'].includes(tag)) attrs.disabled = '';
  const output = Object.entries(attrs)
    .map(([k, v]) => ' ' + k + '="' + htmlEscape(v) + '"')
    .join('');
  return (
    '<' +
    tag +
    output +
    '>' +
    (voidTags.has(tag) ? '' : node.children.map(reviewNode).join('') + '</' + tag + '>')
  );
}
