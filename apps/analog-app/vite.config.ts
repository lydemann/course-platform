/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { cpSync } from 'node:fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: `../../node_modules/.vite`,
    publicDir: 'src/public',
    build: {
      target: ['es2020'],
      outDir: '../../dist/./analog-app/client',
      reportCompressedSize: true,
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
          rollupConfig: {
            plugins: [
              typescriptPaths({
                tsConfigPath: 'tsconfig.base.json',
                preserveExtensions: true,
              }),
            ],
          },
          routeRules: {
            '/': {
              prerender: false,
            },
          },
          preset: 'vercel',
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
        '@analogjs/trpc',
        '@trpc/server',
        'rxfire/**',
        '@ngx-translate/**',
        'ngx-cookie-service/**',
        'ngx-cookie-service-ssr/**',
        'firebase/**',
        '@apollo/client/**',
      ],
    },
    optimizeDeps: {
      esbuildOptions: {
        tsconfig: 'tsconfig.base.json',
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
