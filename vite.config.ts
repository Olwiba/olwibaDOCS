import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import mdx from 'fumadocs-mdx/vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3001,
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
