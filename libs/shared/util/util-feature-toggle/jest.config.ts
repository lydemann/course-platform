/* eslint-disable */
export default {
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/shared/util/util-feature-toggle',
  globals: {  },
  displayName: 'shared-util-util-feature-toggle',
};
