import { CourseAdminPage } from '../support/page-objects/course-admin.po';
import { LoginPage } from '../support/page-objects/login.po';

describe('course-admin', () => {
  beforeEach(() => {
    cy.server();
    CourseAdminPage.goToPage();
  });

  it('should show lesson', () => {
    LoginPage.login();
  });
});
