'use client';

import { DocsHeader } from '@/components/DocsHeader';

const navItems = [
  { label: 'Docs', href: '/docs' },
  { label: 'Components', href: '/docs/components' },
];

export function SiteHeader() {
  return (
    <DocsHeader
      logo={<>olwiba<span className="text-primary">DOCS</span></>}
      navItems={navItems}
      githubUrl="https://github.com/olwiba/olwibaDOCS"
      githubBadge="soon"
    />
  );
}
