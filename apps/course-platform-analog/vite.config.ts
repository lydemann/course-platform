/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { cpSync } from 'node:fs';

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
    server: {
      fs: {
        allow: ['.'],
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
              maxInstances: 3,
            },
          },
          hooks: {
            close: () => {
              cpSync(
                './apps/course-platform-analog/src/firebase.json',
                './dist/apps/course-platform-analog/analog/firebase.json',
                { recursive: true }
              );
              cpSync(
                './apps/course-platform-analog/src/.firebaserc',
                './dist/apps/course-platform-analog/analog/.firebaserc',
                { recursive: true }
              );
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
        'firebase/**',
        '@apollo/client/**',
        'farmhash',
      ],
    },
    optimizeDeps: {
      exclude: ['farmhash'],
      esbuildOptions: {
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
          },
        },
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
  };
});
