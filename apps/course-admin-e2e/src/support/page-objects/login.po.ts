export namespace LoginPage {
  export const login = () => {
    // TODO(@nrwl/cypress): this command has been removed, use cy.intercept instead. https://docs.cypress.io/guides/references/migration-guide#cy-server-cy-route-and-Cypress-Server-defaults
    cy.intercept(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword**',
      'fixture:auth/verify-password'
    );
    // TODO(@nrwl/cypress): this command has been removed, use cy.intercept instead. https://docs.cypress.io/guides/references/migration-guide#cy-server-cy-route-and-Cypress-Server-defaults
    cy.intercept(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo**',
      'fixture:auth/get-account-info'
    );

    cy.visit('/');

    cy.get('[data-test=email]').type('dada@dada.dk');
    cy.get('[data-test=password]').type('dadada');

    cy.get('[data-test=login-btn]').click();
  };
}
