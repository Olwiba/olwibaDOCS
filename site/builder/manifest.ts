export interface BuilderComponent {
  id: string;
  title: string;
  description: string;
  tags: string[];
  demo: string;
  imports: string[];
  snippet: string;
}

export const builderComponents: BuilderComponent[] = [
  {
    id: 'docs-header',
    title: 'DocsHeader',
    description: 'Top navigation header with logo, nav links, search, and mode controls.',
    tags: ['layout', 'navigation', 'header'],
    demo: 'docs-header',
    imports: ["import { DocsHeader } from '@olwiba/docs';"],
    snippet: `<DocsHeader\n  logo="MyDocs"\n  navItems={[\n    { label: 'Docs', href: '/docs' },\n    { label: 'Blog', href: '/blog' },\n  ]}\n  githubUrl="https://github.com/example/repo"\n/>`,
  },
  {
    id: 'docs-sidebar',
    title: 'DocsSidebar',
    description: 'Left-side docs navigation tree with section links.',
    tags: ['layout', 'navigation', 'sidebar'],
    demo: 'docs-sidebar',
    imports: [
      "import { DocsSidebar } from '@olwiba/docs';",
      "import { SidebarProvider } from '@olwiba/cn';",
    ],
    snippet: `<SidebarProvider>\n  <DocsSidebar tree={pageTree} sections={sections} />\n</SidebarProvider>`,
  },
  {
    id: 'docs-toc',
    title: 'DocsToc',
    description: 'Table of contents for headings in the active page.',
    tags: ['layout', 'navigation', 'toc'],
    demo: 'docs-toc',
    imports: ["import { DocsToc } from '@olwiba/docs';"],
    snippet: `<DocsToc toc={toc} variant="list" />`,
  },
  {
    id: 'search-button',
    title: 'SearchButton',
    description: 'Trigger button for the site search dialog.',
    tags: ['search', 'navigation'],
    demo: 'search-button',
    imports: ["import { SearchButton } from '@olwiba/docs';"],
    snippet: `<SearchButton placeholder="Search documentation..." shortPlaceholder="Search..." />`,
  },
  {
    id: 'mode-switcher',
    title: 'ModeSwitcher',
    description: 'Theme mode toggle control.',
    tags: ['theme', 'controls'],
    demo: 'mode-switcher',
    imports: ["import { ModeSwitcher } from '@olwiba/docs';"],
    snippet: `<ModeSwitcher />`,
  },
  {
    id: 'theme-selector',
    title: 'ThemeSelector',
    description: 'Switcher for docs color theme presets.',
    tags: ['theme', 'controls'],
    demo: 'theme-selector',
    imports: ["import { ThemeSelector } from '@olwiba/docs';"],
    snippet: `<ThemeSelector />`,
  },
  {
    id: 'callout',
    title: 'Callout',
    description: 'Admonition/callout block for important content.',
    tags: ['content', 'feedback'],
    demo: 'callout',
    imports: ["import { Callout } from '@olwiba/docs';"],
    snippet: `<Callout title="Note" variant="info">\n  This is an informational callout.\n</Callout>`,
  },
  {
    id: 'code-fence',
    title: 'CodeFence',
    description: 'Code block with optional title and copy support.',
    tags: ['content', 'code'],
    demo: 'code-fence',
    imports: ["import { CodeFence } from '@olwiba/docs';"],
    snippet: `<CodeFence language="tsx" title="example.tsx">\n{` + "'const message = \"Hello\";'" + `}\n</CodeFence>`,
  },
  {
    id: 'copy-button',
    title: 'CopyButton',
    description: 'Clipboard copy action button with feedback states.',
    tags: ['controls', 'code'],
    demo: 'copy-button',
    imports: ["import { CopyButton } from '@olwiba/docs';"],
    snippet: `<CopyButton text="npm install @olwiba/docs" />`,
  },
  {
    id: 'docs-footer',
    title: 'DocsFooter',
    description: 'Bottom site footer for docs projects.',
    tags: ['layout', 'footer'],
    demo: 'docs-footer',
    imports: ["import { DocsFooter } from '@olwiba/docs';"],
    snippet: `<DocsFooter changelogUrl="https://github.com/example/repo/blob/main/CHANGELOG.md" />`,
  },
];

export const builderComponentMap = new Map(
  builderComponents.map((component) => [component.id, component]),
);
