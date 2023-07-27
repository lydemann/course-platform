const { withModuleFederation } = require('@nx/angular/module-federation');
const config = require('./module-federation.config');
module.exports = withModuleFederation({
  ...config,
  /*
   * Remote overrides for production.
   * Each entry is a pair of an unique name and the URL where it is deployed.
   */
  // TODO: move to dynamic config + and set in CI
  remotes: [
    ['course-admin', 'https://aaa-course-portal-admin.web.app']
  ],
});
