import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/lib/source.ts',
    'src/lib/mdx-components.tsx',
  ],
  format: ['esm'],
  dts: false, // TODO: Re-enable when @olwiba/cn has type declarations
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
