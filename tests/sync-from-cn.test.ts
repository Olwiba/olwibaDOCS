import { describe, expect, it } from 'vitest';
import { transformImports } from '../scripts/sync-from-cn';

describe('sync import transforms', () => {
  it('rewrites component ui imports to the published cn package', () => {
    const input = `
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
`;

    expect(transformImports(input, 'src/components/Example.tsx')).toContain(
      "import { Button } from '@olwiba/cn';\nimport { Card,\n  CardContent, } from '@olwiba/cn';"
    );
  });

  it('rewrites source aliases according to the destination surface', () => {
    const input = `
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { SearchDialog } from '@/docs/components/SearchDialog';
`;

    expect(transformImports(input, 'src/components/Example.tsx')).toContain(
      "from '../lib/utils'"
    );
    expect(transformImports(input, 'src/components/Example.tsx')).toContain(
      "from '../hooks/use-copy-to-clipboard'"
    );
    expect(transformImports(input, 'src/components/Example.tsx')).toContain(
      "from './SearchDialog'"
    );

    expect(transformImports(input, 'site/routes/api/search/index.ts')).toContain(
      "from '~/lib/utils'"
    );
  });
});
