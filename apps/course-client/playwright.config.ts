import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4200', // Adjust this to your application's URL
    headless: false,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
  },
};

export default config;
