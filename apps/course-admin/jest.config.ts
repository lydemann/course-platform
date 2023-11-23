export default {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/course-admin',

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  displayName: 'course-admin',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        stringifyContentPathRegex: '\\.(html|svg)$',

        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
};
