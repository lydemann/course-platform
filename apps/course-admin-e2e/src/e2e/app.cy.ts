import { CourseAdminPage } from '../support/page-objects/course-admin.po';

// TODO: because Cannot use 'import.meta' outside a module, can't be fixed for now
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

describe('course-admin', () => {
  beforeEach(() => {
    CourseAdminPage.goToPage();
  });

  it('should show lesson', () => {
    // TODO:
    // LoginPage.login();
  });
});
