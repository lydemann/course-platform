import { defineConfig, devices } from '@playwright/test';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineBddConfig } from 'playwright-bdd';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4201';
const featuresRoot = `${workspaceRoot}/libs/course-admin/login/feature/src/lib`;
const testDir = defineBddConfig({
  features: `${featuresRoot}/login.feature`,
  featuresRoot,
  steps: 'src/steps/**/*.ts',
  outputDir: '.features-gen',
});

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir }),
  use: {
    baseURL,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env['BASE_URL']
    ? undefined
    : {
        command:
          'corepack pnpm nx serve course-admin --configuration=production',
        url: baseURL,
        reuseExistingServer: !process.env['CI'],
        cwd: workspaceRoot,
        timeout: 300_000,
      },
});
