import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/lib/source.ts',
    'src/lib/mdx-components.tsx',
    'src/lib/server.ts',
    'src/lib/themes.ts',
    'src/lib/dev-banner.ts',
  ],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@tanstack/react-router',
    '@olwiba/cn',
  ],
  treeshake: true,
  minify: false,
});

