import { test } from '@playwright/test';
import { CoursesPage } from './page-objects/courses.po';
import { LoginPage } from './page-objects/login.po';

test.describe('course-client', () => {
  let coursesPage: CoursesPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    coursesPage = new CoursesPage(page);
    loginPage = new LoginPage(page);
  });

  test('should show lesson', async ({ page }) => {
    await loginPage.login();
    await coursesPage.goto();
    await coursesPage.verifyLessonVisible();
  });
});
