import { DocsToc } from '@/components/DocsToc';
import type { TocItem } from '@/components/DocsToc';

const sampleToc: TocItem[] = [
  { title: 'Import', url: '#import', depth: 2 },
  { title: 'Usage', url: '#usage', depth: 2 },
  { title: 'Basic Example', url: '#basic-example', depth: 3 },
  { title: 'Advanced Example', url: '#advanced-example', depth: 3 },
  { title: 'API Reference', url: '#api-reference', depth: 2 },
];

export default function DocsTocDemo() {
  return (
    <div className="w-full max-w-xs">
      <DocsToc toc={sampleToc} />
    </div>
  );
}
