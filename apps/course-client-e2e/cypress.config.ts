import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';
import setupNodeEvents from './src/plugins/index';

const cypressJsonConfig = {
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videosFolder: '../../dist/cypress/apps/course-client-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/course-client-e2e/screenshots',
  chromeWebSecurity: false,
  specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  supportFile: 'src/support/e2e.ts',
  defaultCommandTimeout: 10000,
};
export default defineConfig({
  e2e: {
    baseUrl: process.env['BASE_URL'] || 'http://localhost:4200',
    ...nxE2EPreset(__dirname, {
      webServerCommands: {
        default: 'npx nx run course-client:serve',
        production: 'npx nx run course-client:serve:production',
      },
    }),
    ...cypressJsonConfig,
    setupNodeEvents,
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
