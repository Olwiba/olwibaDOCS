import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatePreviews } from '@olwiba/dx/generate-previews';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await generatePreviews({
  baseUrl: 'http://localhost:3001',
  outputDir: path.join(__dirname, '../public/iso-previews'),
  manifestPath: path.join(__dirname, '../site/iso-previews-manifest.json'),
  themes: ['light', 'dark'],
  selector: null,
  viewport: { width: 1280, height: 800 },
  components: [
    { name: 'docs-layout' },
    { name: 'docs-sidebar' },
    { name: 'docs-header' },
    { name: 'docs-toc' },
    { name: 'docs-footer' },
    { name: 'docs-provider' },
    { name: 'docs-mobile-nav' },
    { name: 'docs-copy-page' },
    { name: 'code-fence' },
    { name: 'copy-button' },
    { name: 'api-reference' },
    { name: 'active-theme' },
    { name: 'mode-switcher' },
    { name: 'sandbox' },
    { name: 'search-dialog' },
    { name: 'mdx-components' },
  ],
});
