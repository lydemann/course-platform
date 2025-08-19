/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: `../../node_modules/.vite`,
    build: {
      target: ['es2020'],
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      outDir: '../../dist/./course-platform-analog/client',
      reportCompressedSize: false, // Disable to save memory
      chunkSizeWarningLimit: 1000,
      sourcemap: false, // Disable source maps to save memory
      minify: 'esbuild', // Use faster esbuild instead of terser
      terserOptions: undefined, // Don't use terser
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
    plugins: [
      analog({
        prerender: {
          routes: [],
        },

        nitro: {
          routeRules: {
            // All admin URLs are only rendered on the client
            '/admin/**': { ssr: false },
            // Reset password page needs client-side rendering for token handling
            '/reset-password': { ssr: false },
          },
          preset: 'vercel',
          rollupConfig: {
            plugins: [
              typescriptPaths({
                tsConfigPath: 'tsconfig.base.json',
                preserveExtensions: true,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              }) as any,
            ],
          },
        },
      }),
      nxViteTsPaths(),
      splitVendorChunkPlugin(),
    ],
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
        'uuid',
        'tslib',
        '@angular/**',
        'rxjs/**',
        '@ngrx/**',
        '@supabase/**',
        'ngx-cookie-service/**',
        'ngx-cookie-service-ssr/**',
        '@course-platform/**',
      ],
    },
    optimizeDeps: {
      include: [
        '@angular/core',
        '@angular/common',
        '@angular/platform-browser',
        'rxjs',
      ],
      exclude: [
        '@course-platform/course-client/feature',
        '@course-platform/course-admin',
      ],
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
  };
});
