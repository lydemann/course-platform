import { expect, test } from '@playwright/test';

test('anonymous users see the login form when opening courses', async ({
  page,
}, testInfo) => {
  await page.goto('/courses');
  await expect(page).toHaveURL(/\/login(?:[?#].*)?$/);
  await expect(page.getByTestId('email')).toBeVisible();
  await expect(page.getByTestId('password')).toBeVisible();
  await expect(page.getByTestId('login-btn')).toBeVisible();
  await testInfo.attach('login-page', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});
