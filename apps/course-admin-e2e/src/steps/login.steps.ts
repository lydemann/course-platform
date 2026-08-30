import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('I am not authenticated in course admin', async ({ context }) => {
  await context.clearCookies();
});

When('I open the protected course admin courses page', async ({ page }) => {
  await page.goto('/courses');
});

Then('the course admin login page is shown', async ({ page }) => {
  await expect(page).toHaveURL(/\/login(?:[?#].*)?$/);
  await expect(page.getByTestId('email')).toBeVisible();
  await expect(page.getByTestId('password')).toBeVisible();
  await expect(page.getByTestId('login-btn')).toBeVisible();
});
