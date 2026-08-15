describe('course-admin', () => {
  it('redirects anonymous users to login', () => {
    cy.visit('/courses');

    cy.url().should('include', '/login');
    cy.get('[data-test=email]').should('be.visible');
    cy.get('[data-test=password]').should('be.visible');
    cy.get('[data-test=login-btn]').should('be.visible');
  });
});
