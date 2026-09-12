/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: import.meta.dirname,
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
    resolve: {
      conditions: ['module', 'browser', 'development|production'],
      tsconfigPaths: true,
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
            '/update-password': { ssr: false },
            // Supabase OAuth consent relies on the browser session.
            '/oauth/consent': { ssr: false },
            // MCP clients discover OAuth metadata at root-level RFC 9728 URLs,
            // while Analog exposes server routes under its /api prefix.
            '/.well-known/oauth-protected-resource': {
              proxy: { to: '/api/oauth-protected-resource' },
            },
            '/.well-known/oauth-protected-resource/api/mcp': {
              proxy: { to: '/api/oauth-protected-resource' },
            },
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
    ],
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['libs/shared/ui/styles/src/lib'],
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
        'uuid',
        'tslib',
        'ngx-cookie-service/**',
        'ngx-cookie-service-ssr/**',
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
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
