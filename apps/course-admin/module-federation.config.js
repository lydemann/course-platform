module.exports = {
  name: 'course-admin',
  exposes: {
    './Module': 'libs/course-admin/shell/src/lib/entry.module.ts',
  },
  additionalShared: [
    ['@apollo/client/core', { singleton: true, requiredVersion: false }],
    ['@apollo/client/cache', { singleton: true, requiredVersion: false }],
    ['@apollo/client/link', { singleton: true, requiredVersion: false }],
    ['@apollo/client/link/batch', { singleton: true, requiredVersion: false }],
    ['firebase/app', { singleton: true, requiredVersion: false }],
    ['firebase/firestore', { singleton: true, requiredVersion: false }],
    ['firebase/auth', { singleton: true, requiredVersion: false }],
    ['firebase', { singleton: true, requiredVersion: false }],
    ['firebase/remote-config', { singleton: true, requiredVersion: false }],
    ['firebase/messaging', { singleton: true, requiredVersion: false }],
    ['firebase/analytics', { singleton: true, requiredVersion: false }],
    ['firebase/app-check', { singleton: true, requiredVersion: false }],
  ],
};
