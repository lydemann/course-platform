export namespace LoginPage {
  export const goToLogout = () => {
    cy.visit('/logout');
  };

  export const isLoggedIn = () => {
    return cy.url().then((url) => {
      return url.includes('/login');
    });
  };

  export const login = (redirectTo = '/courses') => {
    cy.get('[data-test=email]').type('dada@dada.dk');
    cy.get('[data-test=password]').type('dadada');
    cy.get('[data-test=login-btn]').click();
  };
}
