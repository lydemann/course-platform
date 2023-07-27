const { getJestProjects } = require('@nx/jest');

export default {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/course-client',
    '<rootDir>/libs/course-client-lib',
    '<rootDir>/apps/course-admin',
    '<rootDir>/libs/shared/interfaces',
    '<rootDir>/libs/shared/util/util-feature-toggle',
    '<rootDir>/apps/course-service',
    '<rootDir>/libs/shared/data-access',
    '<rootDir>/libs/shared/feat-auth',
    '<rootDir>/libs/course-admin-lib',
  ],
};
