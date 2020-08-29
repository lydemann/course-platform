export const environment = {
  production: true,

  get courseServiceUrl() {
    return window.config.courseServiceUrl;
  }
};
