const { withModuleFederation } = require('@nx/module-federation/angular');
const config = require('./module-federation.config');
module.exports = withModuleFederation({
  dts: false,
  ...config,
  /*
   * Remote overrides for production.
   * Each entry is a pair of an unique name and the URL where it is deployed.
   */
  // TODO: move to dynamic config + and set in CI
  remotes: [['course-admin', 'https://aaa-course-portal-admin.web.app']],
});
