#!/usr/bin/env bun
/**
 * Syncs doc components from olwibaCN to olwibaDOCS.
 *
 * olwibaCN is the workshop — components are built there with direct access
 * to UI primitives via `@/components/ui/*`. This script copies them into
 * olwibaDOCS and rewrites imports so they reference the published `@olwiba/cn`
 * package and correct relative paths for the flat `src/components/` layout.
 *
 * Run: bun run scripts/sync-from-cn.ts
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

const CN_ROOT = 'C:/Workspace/olwibaCN';
const DOCS_ROOT = 'C:/Workspace/olwibaDOCS';

const GENERATED_BANNER = '// @generated — synced from olwibaCN by sync-from-cn.ts. DO NOT EDIT.\n';

// ─── File mappings ───────────────────────────────────────────────────────────
// CN source path (relative to CN_ROOT) → DOCS dest path (relative to DOCS_ROOT)

const SYNC_MAP: Array<{ src: string; dest: string }> = [
  // Doc components (CN: src/components/docs/ → DOCS: src/components/)
  { src: 'src/components/docs/APIReference.tsx', dest: 'src/components/APIReference.tsx' },
  { src: 'src/components/docs/Callout.tsx', dest: 'src/components/Callout.tsx' },
  { src: 'src/components/docs/CodeFence.tsx', dest: 'src/components/CodeFence.tsx' },
  { src: 'src/components/docs/CopyButton.tsx', dest: 'src/components/CopyButton.tsx' },
  { src: 'src/components/docs/DocsCopyPage.tsx', dest: 'src/components/DocsCopyPage.tsx' },
  { src: 'src/components/docs/DocsMobileNav.tsx', dest: 'src/components/DocsMobileNav.tsx' },
  { src: 'src/components/docs/DocsSidebar.tsx', dest: 'src/components/DocsSidebar.tsx' },
  { src: 'src/components/docs/DocsToc.tsx', dest: 'src/components/DocsToc.tsx' },
  { src: 'src/components/docs/SearchButton.tsx', dest: 'src/components/SearchButton.tsx' },
  { src: 'src/components/docs/SearchDialog.tsx', dest: 'src/components/SearchDialog.tsx' },
  { src: 'src/components/docs/ThemeCodeBlock.tsx', dest: 'src/components/ThemeCodeBlock.tsx' },
  { src: 'src/components/docs/CopyCommandButton.tsx', dest: 'src/components/CopyCommandButton.tsx' },

  // Shared layout components (CN: src/components/docs/ → DOCS: src/components/)
  { src: 'src/components/docs/DocsHeader.tsx', dest: 'src/components/DocsHeader.tsx' },
  { src: 'src/components/docs/DocsFooter.tsx', dest: 'src/components/DocsFooter.tsx' },
  { src: 'src/components/docs/DocsLayout.tsx', dest: 'src/components/DocsLayout.tsx' },

  // Site-level components (CN: src/components/ → DOCS: src/components/)
  { src: 'src/components/active-theme.tsx', dest: 'src/components/ActiveTheme.tsx' },
  { src: 'src/components/ModeSwitcher.tsx', dest: 'src/components/ModeSwitcher.tsx' },
  { src: 'src/components/ThemeSelector.tsx', dest: 'src/components/ThemeSelector.tsx' },

  // Hooks
  { src: 'src/hooks/use-copy-to-clipboard.ts', dest: 'src/hooks/use-copy-to-clipboard.ts' },
];

// ─── Import transforms ──────────────────────────────────────────────────────
// DOCS components live in src/components/ (flat), so relative paths go up 1 level.

function transformImports(content: string, destPath: string): string {
  let result = content;

  // Merge all @/components/ui/* imports into @olwiba/cn
  // Handles both single-line and multi-line import blocks
  result = result.replace(
    /import\s+\{[^}]*\}\s+from\s+['"]@\/components\/ui\/[^'"]+['"]\s*;?\n?/g,
    (match) => {
      // Extract the imported names
      const names = match.match(/\{([^}]*)\}/)?.[1]?.trim();
      if (!names) return '';
      return `import { ${names} } from '@olwiba/cn';\n`;
    }
  );

  // @/components/ui (barrel) → @olwiba/cn
  result = result.replace(
    /from\s+['"]@\/components\/ui['"]/g,
    "from '@olwiba/cn'"
  );

  // @/lib/confetti → @olwiba/cn (confetti is exported from the CN package)
  result = result.replace(
    /['"]@\/lib\/confetti['"]/g,
    "'@olwiba/cn'"
  );

  // @/lib/utils → ../lib/utils (1 level up from src/components/)
  result = result.replace(/@\/lib\/utils/g, '../lib/utils');

  // @/lib/* → ../lib/* (for themes etc.)
  result = result.replace(/@\/lib\//g, '../lib/');

  // @/hooks/* → ../hooks/*
  result = result.replace(/@\/hooks\//g, '../hooks/');

  // @/components/active-theme → ./ActiveTheme (same directory in DOCS)
  result = result.replace(
    /['"]@\/components\/active-theme['"]/g,
    "'./ActiveTheme'"
  );

  // @/components/ModeSwitcher → ./ModeSwitcher (same directory in DOCS)
  result = result.replace(
    /['"]@\/components\/ModeSwitcher['"]/g,
    "'./ModeSwitcher'"
  );

  // ./CodeFence (relative within docs/) stays ./ (same directory in DOCS)
  // No change needed — both are flat in src/components/

  return result;
}

/**
 * Consolidate multiple @olwiba/cn imports into a single import statement.
 * After individual transforms, we may end up with:
 *   import { A } from '@olwiba/cn';
 *   import { B } from '@olwiba/cn';
 * This merges them into:
 *   import { A, B } from '@olwiba/cn';
 */
function consolidateCnImports(content: string): string {
  const cnImportRegex = /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*['"]@olwiba\/cn['"]\s*;?\s*\n/g;
  const regularNames: string[] = [];
  const typeNames: string[] = [];

  let match;
  while ((match = cnImportRegex.exec(content)) !== null) {
    const line = content.slice(match.index, match.index + match[0].length);
    const isTypeImport = /^import\s+type\s/.test(line);
    const names = match[1]
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);

    if (isTypeImport) {
      typeNames.push(...names);
    } else {
      // Check for inline `type` keywords
      for (const name of names) {
        if (name.startsWith('type ')) {
          typeNames.push(name.replace('type ', ''));
        } else {
          regularNames.push(name);
        }
      }
    }
  }

  // If 0 or 1 imports, nothing to consolidate
  const allMatches = content.match(cnImportRegex);
  if (!allMatches || allMatches.length <= 1) return content;

  // Remove all @olwiba/cn imports
  let result = content.replace(cnImportRegex, '');

  // Build consolidated import
  const allNames = [...new Set(regularNames)];
  if (typeNames.length > 0) {
    const uniqueTypes = [...new Set(typeNames)].map((n) => `type ${n}`);
    allNames.push(...uniqueTypes);
  }

  if (allNames.length > 0) {
    const consolidated = `import {\n  ${allNames.join(',\n  ')},\n} from '@olwiba/cn';\n`;
    // Insert after the last non-import line before the first code
    const firstImportIdx = result.search(/^import\s/m);
    if (firstImportIdx >= 0) {
      // Find the end of the import block
      const lines = result.split('\n');
      let lastImportLine = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ') || lines[i].startsWith('} from ') || /^\s+/.test(lines[i]) && i > 0 && lines[i - 1].includes('import')) {
          lastImportLine = i;
        }
      }
      lines.splice(lastImportLine + 1, 0, consolidated);
      result = lines.join('\n');
    } else {
      result = consolidated + result;
    }
  }

  return result;
}

async function syncFile(srcPath: string, destPath: string) {
  const content = await readFile(srcPath, 'utf-8');
  let transformed = transformImports(content, destPath);
  transformed = consolidateCnImports(transformed);
  transformed = GENERATED_BANNER + transformed;

  // Ensure directory exists
  const dir = dirname(destPath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  await writeFile(destPath, transformed);
  console.log(`  ✓ ${srcPath} → ${destPath}`);
}

async function main() {
  console.log('Syncing doc components from olwibaCN to olwibaDOCS...\n');

  let synced = 0;
  let skipped = 0;
  const missing: string[] = [];

  for (const { src, dest } of SYNC_MAP) {
    const srcPath = join(CN_ROOT, src);
    const destPath = join(DOCS_ROOT, dest);

    if (existsSync(srcPath)) {
      await syncFile(srcPath, destPath);
      synced++;
    } else {
      console.log(`  ⚠ Not found: ${src}`);
      missing.push(src);
      skipped++;
    }
  }

  console.log(`\n✅ Synced ${synced} files${skipped ? `, ${skipped} missing` : ''}`);
  if (missing.length) {
    console.log('\nMissing files:');
    missing.forEach((f) => console.log(`  - ${f}`));
  }
  console.log('\nNext: run `bun run types:check` to verify.');
}

main().catch(console.error);
