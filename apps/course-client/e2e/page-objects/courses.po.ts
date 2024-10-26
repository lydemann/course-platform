import { Page, expect } from '@playwright/test';

export class CoursesPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/courses');
  }

  async verifyLessonVisible() {
    const lessonContent = await this.page.waitForSelector('.lesson-content');
    expect(lessonContent).toBeTruthy();
  }
}
