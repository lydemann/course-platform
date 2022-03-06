module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/course-service',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'course-service',
  testEnvironment: 'node',
};
