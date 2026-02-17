import type { Root } from 'fumadocs-core/page-tree';

const mockTree: Root = {
  name: 'Docs',
  children: [
    { type: 'page', name: 'Introduction', url: '/docs' },
    { type: 'page', name: 'Installation', url: '/docs/installation' },
  ],
};

export default function DocsMobileNavDemo() {
  return (
    <div className="text-sm text-fd-muted-foreground">
      <p>DocsMobileNav renders a slide-out sheet triggered via a portal in the site header.</p>
      <p className="mt-1">It is best demonstrated on mobile viewports.</p>
    </div>
  );
}
