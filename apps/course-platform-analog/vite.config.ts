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
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Angular core chunks
            if (
              id.includes('@angular/core') ||
              id.includes('@angular/common') ||
              id.includes('@angular/platform-browser')
            ) {
              return 'angular-core';
            }
            if (id.includes('@angular/router')) {
              return 'angular-router';
            }
            if (
              id.includes('@angular/forms') ||
              id.includes('@angular/reactive-forms')
            ) {
              return 'angular-forms';
            }
            if (
              id.includes('@angular/material') ||
              id.includes('@angular/cdk')
            ) {
              return 'angular-material';
            }

            // Third-party libraries
            if (id.includes('rxjs')) {
              return 'rxjs';
            }
            if (id.includes('@apollo/client') || id.includes('apollo')) {
              return 'apollo';
            }
            if (id.includes('@trpc') || id.includes('trpc')) {
              return 'trpc';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }

            // UI libraries
            if (id.includes('primeng')) {
              return 'primeng';
            }

            // Course platform chunks
            if (id.includes('@course-platform/course-client/feature')) {
              return 'course-client-features';
            }
            if (id.includes('@course-platform/course-admin')) {
              return 'course-admin';
            }
            if (id.includes('@course-platform/shared/ui')) {
              return 'shared-ui';
            }

            // Large vendor libraries
            if (id.includes('node_modules')) {
              return 'vendor';
            }

            // Default chunk for everything else
            return undefined;
          },
        },
      },
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
