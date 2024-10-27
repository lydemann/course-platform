import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login() {
    // Intercept the getAccountInfo request
    await this.page.route(
      '**/identitytoolkit/v3/relyingparty/getAccountInfo**',
      async (route) => {
        // TODO: Implement the correct response fixture
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            /* mock response data */
          }),
        });
      }
    );

    await this.page.goto('/login');

    await this.page.getByTestId('email').fill('dada@dada.dk');
    await this.page.getByTestId('password').fill('dadada');

    await this.page.getByTestId('login-btn').click();
  }
}
