module.exports = {
  name: 'course-client',
  remotes: ['course-admin'],
  additionalShared: [
    ['@apollo/client/core', { singleton: true, requiredVersion: false }],
    ['@apollo/client/cache', { singleton: true, requiredVersion: false }],
    ['@apollo/client/link', { singleton: true, requiredVersion: false }],
    ['@apollo/client/link/batch', { singleton: true, requiredVersion: false }],
    ['firebase/app', { singleton: true, requiredVersion: false }],
    ['firebase/firestore', { singleton: true, requiredVersion: false }],
    ['firebase/auth', { singleton: true, requiredVersion: false }],
    ['firebase', { singleton: true, requiredVersion: false }],
  ],
};
