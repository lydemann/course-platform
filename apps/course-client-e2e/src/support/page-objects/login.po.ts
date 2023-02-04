export namespace LoginPage {
  export const login = () => {
    cy.intercept(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo**',
      'fixture:auth/get-account-info'
    );

    cy.visit('/login');

    cy.get('[data-test=email]').type('dada@dada.dk');
    cy.get('[data-test=password]').type('dadada');

    cy.get('[data-test=login-btn]').click();
  };
}
