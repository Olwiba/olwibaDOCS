import { DocsSidebar } from '@/components/DocsSidebar';
import { SidebarProvider } from '@olwiba/cn';
import type { Root } from 'fumadocs-core/page-tree';

const mockTree: Root = {
  name: 'Docs',
  children: [
    { type: 'page', name: 'Introduction', url: '/docs' },
    { type: 'page', name: 'Installation', url: '/docs/installation' },
    {
      type: 'folder',
      name: 'Components',
      children: [
        { type: 'page', name: 'Button', url: '/docs/components/button' },
        { type: 'page', name: 'Card', url: '/docs/components/card' },
      ],
    },
  ],
};

const sections = [
  { name: 'Get Started', href: '/docs' },
  { name: 'Components', href: '/docs/components' },
];

export default function DocsSidebarDemo() {
  return (
    <div className="w-64 h-[300px] overflow-hidden border rounded-lg">
      <SidebarProvider>
        <DocsSidebar tree={mockTree} sections={sections} />
      </SidebarProvider>
    </div>
  );
}
