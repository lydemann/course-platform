/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite',
    build: {
      outDir: '../../dist/apps/analogjs-demo/analogjs-demo/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    plugins: [
      analog({
        prerender: {
          routes: [],
        },
        nitro: {
          preset: 'vercel',
        },
      }),

      nxViteTsPaths(),
    ],
    server: {
      fs: {
        allow: ['.'],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
