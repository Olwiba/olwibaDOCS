'use client';

import { DocsHeader } from '@/components/DocsHeader';

const navItems = [
  { label: 'Docs', href: '/docs' },
  { label: 'Reference', href: '/docs/components' },
  { label: 'Builder', href: '/builder' },
];

export function SiteHeader() {
  return (
    <DocsHeader
      logo={<>olwiba<span className="text-primary">DOCS</span></>}
      navItems={navItems}
      githubUrl="https://github.com/Olwiba/olwibaDOCS"
    />
  );
}
