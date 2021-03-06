module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/course-service',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'course-service',
};
