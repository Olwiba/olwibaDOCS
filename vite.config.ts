import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import mdx from 'fumadocs-mdx/vite';
import { resolve } from 'path';
import { createDevBannerPlugin } from '@olwiba/dx';

export default defineConfig({
  server: {
    port: 3001,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@olwiba/docs': resolve('./src/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['react-resizable-panels'],
    esbuildOptions: {
      mainFields: ['module', 'main'],
    },
  },
  ssr: {
    noExternal: ['react-resizable-panels'],
  },
  plugins: [
    createDevBannerPlugin({
      segments: [
        { text: 'olwiba' },
        { text: 'DOCS', colorHex: '#f59e0b' },
      ],
      compactSegments: [
        { text: 'o' },
        { text: 'DOCS', colorHex: '#f59e0b' },
      ],
    }),
    mdx(await import('./source.config')),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      srcDirectory: 'site',
    }),
    react(),
  ],
});
