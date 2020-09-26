export namespace LoginPage {
  export const login = () => {
    cy.route(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword**',
      'fixture:auth/verify-password'
    );
    cy.route(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo**',
      'fixture:auth/get-account-info'
    );

    cy.visit('/login');

    cy.get('[data-test=email]').type('dada@dada.dk');
    cy.get('[data-test=password]').type('dadada');

    cy.get('[data-test=login-btn]').click();
  };
}
