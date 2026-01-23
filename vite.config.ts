import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';

export default defineConfig({
  server: {
    port: 3001,
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
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      srcDirectory: 'site',
      customViteReactPlugin: true,
    }),
    react(),
  ],
});
