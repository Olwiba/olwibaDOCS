import { defineConfig } from 'tsup';
import { createTsupBannerHook } from '@olwiba/dx';
import { projectBanner } from './src/project.config';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/lib/source.ts',
    'src/lib/mdx-components.tsx',
    'src/lib/server.ts',
    'src/lib/themes.ts',
    'src/lib/feedback.ts',
  ],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@tanstack/react-router',
    '@olwiba/cn',
    'shiki',
  ],
  treeshake: true,
  minify: false,
  onSuccess: createTsupBannerHook(projectBanner),
});
