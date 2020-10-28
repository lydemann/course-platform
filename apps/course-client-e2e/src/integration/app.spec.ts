import { CoursePage } from '../support/page-objects/course.po';
import { LoginPage } from '../support/page-objects/login.po';

describe('course-client', () => {
  beforeEach(() => CoursePage.goToPage());

  it('should show lesson', () => {
    // TODO:
    // LoginPage.login();
    // CoursePage.seeLesson();
  });
});
