import { DocsFooter } from '@/components/DocsFooter';

export default function DocsFooterDemo() {
  return (
    <div className="w-full max-w-2xl border rounded-lg overflow-hidden">
      <DocsFooter changelogUrl="https://github.com/olwiba/olwibaDOCS/blob/main/changelog.md" />
    </div>
  );
}
