const { getJestProjects } = require('@nx/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/course-client',
    '<rootDir>/libs/course-client',
    '<rootDir>/apps/course-admin',
    '<rootDir>/libs/shared/interfaces',
    '<rootDir>/libs/shared/util/util-feature-toggle',
    '<rootDir>/libs/shared/data-access',
    '<rootDir>/libs/shared/auth/domain',
    '<rootDir>/libs/course-admin-lib',
  ],
};
