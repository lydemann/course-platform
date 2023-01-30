import { CoursePage } from '../support/page-objects/course.po';
import { LoginPage } from '../support/page-objects/login.po';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

describe('course-client', () => {
  beforeEach(() => CoursePage.goToPage());

  it('should show lesson', () => {
    // TODO:
    // LoginPage.login();
    // CoursePage.seeLesson();
  });
});
