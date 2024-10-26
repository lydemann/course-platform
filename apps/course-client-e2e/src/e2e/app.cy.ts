import { CoursesPage } from '../support/page-objects/courses.po';
import { LoginPage } from '../support/page-objects/login.po';

describe('course-client', () => {
  it('should show courses', () => {
    LoginPage.goToLogout();
    LoginPage.login();

    CoursesPage.seeCourse();
  });
});
