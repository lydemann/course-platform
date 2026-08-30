import cypress from 'eslint-plugin-cypress';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  cypress.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
    languageOptions: {
      parserOptions: {
        project: [
          'apps/course-admin-e2e/tsconfig.json',
          'apps/course-admin-e2e/tsconfig.playwright.json',
        ],
      },
    },
  },
];
