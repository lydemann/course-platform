/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',
    build: {
      target: ['es2020'],
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    plugins: [
      analog({
        nitro: {
          preset: 'firebase',
          firebase: {
            nodeVersion: '20',
            gen: 2,
            httpsOptions: {
              region: 'us-central1',
              maxInstances: 10,
            },
          },
        },
      }),
      nxViteTsPaths(),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
      cache: {
        dir: `../../node_modules/.vitest`,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['libs/shared/ui/styles/src/lib'],
        },
      },
    },
    ssr: {
      noExternal: [
        'rxfire/**',
        '@ngx-translate/**',
        'ngx-cookie-service/**',
        'ngx-cookie-service-ssr/**',
        'firebase-admin/**',
        'firebase/**',
      ],
    },
    optimizeDeps: {
      include: ['hash.js/**', 'firebase-admin/**', 'firebase/**'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
