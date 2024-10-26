export namespace LoginPage {
  export const goToLogout = () => {
    cy.visit('/logout');
  };

  export const login = (redirectTo = '/courses') => {
    cy.get('[data-test=email]').type('dada@dada.dk');
    cy.get('[data-test=password]').type('dadada');
    cy.get('[data-test=login-btn]').click();
  };
}
