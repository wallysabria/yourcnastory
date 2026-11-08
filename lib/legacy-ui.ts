import policy from '@/content/migration/legacy-ui-policy.json';
import type { ContentNode } from './content-schema';
export function isLegacyChat(node: ContentNode) {
  if (node.type !== 'element') return false;
  const classes = (node.source?.classes || '').split(/\s+/);
  return (
    policy.classNames.some((name) => classes.includes(name)) ||
    policy.idPrefixes.some((prefix) => (node.attrs.id || '').startsWith(prefix))
  );
}
