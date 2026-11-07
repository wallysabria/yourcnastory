import Link from 'next/link';
import type { ReactNode } from 'react';
import { hrefFor, isLinkDisabled } from '@/lib/routing';
export function SiteLink({
  href,
  employer = false,
  enabled = false,
  children,
  className,
}: {
  href: string;
  employer?: boolean;
  enabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (isLinkDisabled(href, employer, enabled))
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    );
  return (
    <Link className={className} href={hrefFor(href)}>
      {children}
    </Link>
  );
}
