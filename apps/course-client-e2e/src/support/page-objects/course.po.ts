export class CoursePage {
  static goToPage() {
    cy.visit('/course');
    cy.server();
    cy.route(
      'http://localhost:3333/api/sections',
      'fixture:course-sections.json'
    );
  }

  static seeLesson() {
    cy.get('[data-test=lesson]').should('be.visible');
  }
}
