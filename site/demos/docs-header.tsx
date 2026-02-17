import { DocsHeader } from '@/components/DocsHeader';

export default function DocsHeaderDemo() {
  return (
    <div className="w-full max-w-2xl border rounded-lg overflow-hidden">
      <DocsHeader
        logo="MyDocs"
        navItems={[
          { label: 'Docs', href: '/docs' },
          { label: 'Blog', href: '/blog' },
        ]}
        githubUrl="https://github.com/example/repo"
      />
    </div>
  );
}
