import { CoursePage } from '../support/page-objects/course.po';

describe('course-client', () => {
  beforeEach(() => CoursePage.goToPage());

  it('should show lesson', () => {
    CoursePage.seeLesson();
  });
});
