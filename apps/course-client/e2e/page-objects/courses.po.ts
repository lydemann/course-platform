import { Page, expect } from '@playwright/test';

export class CoursesPage {
  constructor(private page: Page) {}

  async goToPage() {
    await this.page.goto('/courses');
  }

  async seeCourse() {
    const courseElement = await this.page.waitForSelector('[data-test=course]');
    expect(courseElement).toBeTruthy();
  }
}
