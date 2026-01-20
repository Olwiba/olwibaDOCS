#!/usr/bin/env bun
/**
 * Syncs doc components from olwibaCN to olwibaDOCS
 * 
 * Run: bun run scripts/sync-from-cn.ts
 */

import { readdir, copyFile, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

const CN_ROOT = 'C:/Workspace/olwibaCN';
const DOCS_ROOT = 'C:/Workspace/olwibaDOCS';

// Components to sync from olwibaCN/src/components/docs/ to olwibaDOCS/src/components/docs/
const DOC_COMPONENTS = [
  'DocsToc.tsx',
  'DocsSidebar.tsx',
  'DocsCopyPage.tsx',
  'Callout.tsx',
  'SearchDialog.tsx',
  'SearchButton.tsx',
  'CopyButton.tsx',
  'CopyCommandButton.tsx',
  'CodeBlock.tsx',
  'ComponentPreview.tsx',
  'InstallationTabs.tsx',
  // Add more as needed
];

// Site-level components (not in docs/) - sync separately if needed
const SITE_COMPONENTS = [
  'ModeSwitcher.tsx',
  'SiteHeader.tsx',
  'SiteFooter.tsx',
];

// Hooks to sync
const HOOKS = [
  'use-copy-to-clipboard.ts',
];

// Transform imports from @/ to relative or @olwiba/cn
// Note: docs components are in src/components/docs/, so paths go up 2 levels
function transformImports(content: string, filePath: string): string {
  return content
    // Change @/components/ui/* imports to @olwiba/cn
    .replace(/@\/components\/ui\//g, '@olwiba/cn/')
    .replace(/from ['"]@\/components\/ui['"]/g, "from '@olwiba/cn'")
    // Change @/lib/utils to ../../lib/utils (2 levels up from components/docs/)
    .replace(/@\/lib\/utils/g, '../../lib/utils')
    // Change @/hooks/* to ../../hooks/*
    .replace(/@\/hooks\//g, '../../hooks/');
}

async function syncFile(srcPath: string, destPath: string) {
  const content = await readFile(srcPath, 'utf-8');
  const transformed = transformImports(content, destPath);
  
  // Ensure directory exists
  const dir = dirname(destPath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  
  await writeFile(destPath, transformed);
  console.log(`✓ Synced: ${srcPath} → ${destPath}`);
}

async function main() {
  console.log('Syncing doc components from olwibaCN to olwibaDOCS...\n');

  // Sync docs components
  for (const file of DOC_COMPONENTS) {
    const src = join(CN_ROOT, 'src/components/docs', file);
    const dest = join(DOCS_ROOT, 'src/components/docs', file);
    
    if (existsSync(src)) {
      await syncFile(src, dest);
    } else {
      console.log(`⚠ Not found: ${src}`);
    }
  }

  // Sync site components (optional - uncomment if needed)
  // for (const file of SITE_COMPONENTS) {
  //   const src = join(CN_ROOT, 'src/components', file);
  //   const dest = join(DOCS_ROOT, 'src/components', file);
  //   
  //   if (existsSync(src)) {
  //     await syncFile(src, dest);
  //   } else {
  //     console.log(`⚠ Not found: ${src}`);
  //   }
  // }

  // Sync hooks
  for (const file of HOOKS) {
    const src = join(CN_ROOT, 'src/hooks', file);
    const dest = join(DOCS_ROOT, 'src/hooks', file);
    
    if (existsSync(src)) {
      await syncFile(src, dest);
    } else {
      console.log(`⚠ Not found: ${src}`);
    }
  }

  console.log('\n✅ Sync complete!');
  console.log('Run `bun run build` to rebuild, then publish.');
}

main().catch(console.error);
