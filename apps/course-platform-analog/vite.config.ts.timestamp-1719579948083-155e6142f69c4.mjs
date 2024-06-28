// apps/course-platform-analog/vite.config.ts
import analog from 'file:///Users/christian/Documents/Repos/Github/course-platform/node_modules/@analogjs/platform/src/index.js';
import { nxViteTsPaths } from 'file:///Users/christian/Documents/Repos/Github/course-platform/node_modules/@nx/vite/plugins/nx-tsconfig-paths.plugin.js';
import { typescriptPaths } from 'file:///Users/christian/Documents/Repos/Github/course-platform/node_modules/rollup-plugin-typescript-paths/dist/index.js';
import {
  defineConfig,
  splitVendorChunkPlugin,
} from 'file:///Users/christian/Documents/Repos/Github/course-platform/node_modules/vite/dist/node/index.js';
var __vite_injected_original_dirname =
  '/Users/christian/Documents/Repos/Github/course-platform/apps/course-platform-analog';
var vite_config_default = defineConfig(({ mode }) => {
  return {
    root: __vite_injected_original_dirname,
    cacheDir: `../../node_modules/.vite`,
    build: {
      target: ['es2020'],
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      outDir: '../../dist/./course-platform-analog/client',
      reportCompressedSize: true,
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
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwcy9jb3Vyc2UtcGxhdGZvcm0tYW5hbG9nL3ZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2NocmlzdGlhbi9Eb2N1bWVudHMvUmVwb3MvR2l0aHViL2NvdXJzZS1wbGF0Zm9ybS9hcHBzL2NvdXJzZS1wbGF0Zm9ybS1hbmFsb2dcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jaHJpc3RpYW4vRG9jdW1lbnRzL1JlcG9zL0dpdGh1Yi9jb3Vyc2UtcGxhdGZvcm0vYXBwcy9jb3Vyc2UtcGxhdGZvcm0tYW5hbG9nL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jaHJpc3RpYW4vRG9jdW1lbnRzL1JlcG9zL0dpdGh1Yi9jb3Vyc2UtcGxhdGZvcm0vYXBwcy9jb3Vyc2UtcGxhdGZvcm0tYW5hbG9nL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxuXG5pbXBvcnQgYW5hbG9nIGZyb20gJ0BhbmFsb2dqcy9wbGF0Zm9ybSc7XG5pbXBvcnQgeyBueFZpdGVUc1BhdGhzIH0gZnJvbSAnQG54L3ZpdGUvcGx1Z2lucy9ueC10c2NvbmZpZy1wYXRocy5wbHVnaW4nO1xuaW1wb3J0IHsgdHlwZXNjcmlwdFBhdGhzIH0gZnJvbSAncm9sbHVwLXBsdWdpbi10eXBlc2NyaXB0LXBhdGhzJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgc3BsaXRWZW5kb3JDaHVua1BsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgY3BTeW5jIH0gZnJvbSAnbm9kZTpmcyc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgcm9vdDogX19kaXJuYW1lLFxuICAgIGNhY2hlRGlyOiBgLi4vLi4vbm9kZV9tb2R1bGVzLy52aXRlYCxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiBbJ2VzMjAyMCddLFxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIG91dERpcjogJy4uLy4uL2Rpc3QvLi9jb3Vyc2UtcGxhdGZvcm0tYW5hbG9nL2NsaWVudCcsXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogdHJ1ZSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgZnM6IHtcbiAgICAgICAgYWxsb3c6IFsnLiddLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIGFuYWxvZyh7XG4gICAgICAgIG5pdHJvOiB7XG4gICAgICAgICAgcm9sbHVwQ29uZmlnOiB7XG4gICAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAgIHR5cGVzY3JpcHRQYXRocyh7XG4gICAgICAgICAgICAgICAgdHNDb25maWdQYXRoOiAndHNjb25maWcuYmFzZS5qc29uJyxcbiAgICAgICAgICAgICAgICBwcmVzZXJ2ZUV4dGVuc2lvbnM6IHRydWUsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJvdXRlUnVsZXM6IHtcbiAgICAgICAgICAgICcvJzoge1xuICAgICAgICAgICAgICBwcmVyZW5kZXI6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByZXNldDogJ3ZlcmNlbCcsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIG54Vml0ZVRzUGF0aHMoKSxcbiAgICAgIHNwbGl0VmVuZG9yQ2h1bmtQbHVnaW4oKSxcbiAgICBdLFxuICAgIHRlc3Q6IHtcbiAgICAgIGdsb2JhbHM6IHRydWUsXG4gICAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICAgIHNldHVwRmlsZXM6IFsnc3JjL3Rlc3Qtc2V0dXAudHMnXSxcbiAgICAgIGluY2x1ZGU6IFsnKiovKi5zcGVjLnRzJ10sXG4gICAgICByZXBvcnRlcnM6IFsnZGVmYXVsdCddLFxuICAgICAgY2FjaGU6IHtcbiAgICAgICAgZGlyOiBgLi4vLi4vbm9kZV9tb2R1bGVzLy52aXRlc3RgLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgaW5jbHVkZVBhdGhzOiBbJ2xpYnMvc2hhcmVkL3VpL3N0eWxlcy9zcmMvbGliJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgc3NyOiB7XG4gICAgICBub0V4dGVybmFsOiBbXG4gICAgICAgICdAYW5hbG9nanMvdHJwYycsXG4gICAgICAgICdAdHJwYy9zZXJ2ZXInLFxuICAgICAgICAncnhmaXJlLyoqJyxcbiAgICAgICAgJ0BuZ3gtdHJhbnNsYXRlLyoqJyxcbiAgICAgICAgJ25neC1jb29raWUtc2VydmljZS8qKicsXG4gICAgICAgICduZ3gtY29va2llLXNlcnZpY2Utc3NyLyoqJyxcbiAgICAgICAgJ2ZpcmViYXNlLyoqJyxcbiAgICAgICAgJ0BhcG9sbG8vY2xpZW50LyoqJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgIHRzY29uZmlnUmF3OiB7XG4gICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgICBleHBlcmltZW50YWxEZWNvcmF0b3JzOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICAnaW1wb3J0Lm1ldGEudml0ZXN0JzogbW9kZSAhPT0gJ3Byb2R1Y3Rpb24nLFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxPQUFPLFlBQVk7QUFDbkIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxjQUFjLDhCQUE4QjtBQUxyRCxJQUFNLG1DQUFtQztBQVN6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixPQUFPO0FBQUEsTUFDTCxRQUFRLENBQUMsUUFBUTtBQUFBLE1BQ2pCLGlCQUFpQjtBQUFBLFFBQ2YseUJBQXlCO0FBQUEsTUFDM0I7QUFBQSxNQUNBLFFBQVE7QUFBQSxNQUNSLHNCQUFzQjtBQUFBLElBQ3hCO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixJQUFJO0FBQUEsUUFDRixPQUFPLENBQUMsR0FBRztBQUFBLE1BQ2I7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxPQUFPO0FBQUEsVUFDTCxjQUFjO0FBQUEsWUFDWixTQUFTO0FBQUEsY0FDUCxnQkFBZ0I7QUFBQSxnQkFDZCxjQUFjO0FBQUEsZ0JBQ2Qsb0JBQW9CO0FBQUEsY0FDdEIsQ0FBQztBQUFBLFlBQ0g7QUFBQSxVQUNGO0FBQUEsVUFDQSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxXQUFXO0FBQUEsWUFDYjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRixDQUFDO0FBQUEsTUFDRCxjQUFjO0FBQUEsTUFDZCx1QkFBdUI7QUFBQSxJQUN6QjtBQUFBLElBQ0EsTUFBTTtBQUFBLE1BQ0osU0FBUztBQUFBLE1BQ1QsYUFBYTtBQUFBLE1BQ2IsWUFBWSxDQUFDLG1CQUFtQjtBQUFBLE1BQ2hDLFNBQVMsQ0FBQyxjQUFjO0FBQUEsTUFDeEIsV0FBVyxDQUFDLFNBQVM7QUFBQSxNQUNyQixPQUFPO0FBQUEsUUFDTCxLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLGNBQWMsQ0FBQywrQkFBK0I7QUFBQSxRQUNoRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxZQUFZO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osZ0JBQWdCO0FBQUEsUUFDZCxhQUFhO0FBQUEsVUFDWCxpQkFBaUI7QUFBQSxZQUNmLHdCQUF3QjtBQUFBLFVBQzFCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixzQkFBc0IsU0FBUztBQUFBLElBQ2pDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
