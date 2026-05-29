import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Nexus dev: sibling olwibaDX until @olwiba/dx publish includes light/dark scheme fix.
import { generatePreviews } from '../../olwibaDX/src/generate-previews.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await generatePreviews({
  baseUrl: 'http://localhost:3001',
  outputDir: path.join(__dirname, '../public/iso-previews'),
  manifestPath: path.join(__dirname, '../site/iso-previews-manifest.json'),
  themes: ['light', 'dark'],
  selector: '[data-slot="component-preview-canvas"]',
  padding: 16,
  viewport: { width: 1280, height: 800 },
  components: [
    { name: 'docs-layout', selector: null },
    { name: 'sandbox', selector: null },
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
    { name: 'search-dialog' },
    { name: 'mdx-components' },
  ],
});
