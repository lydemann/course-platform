export class CoursePage {
  static goToPage() {
    cy.visit('/course');
  }

  static seeLesson() {
    cy.get('[data-test=lesson]').should('be.visible');
  }
}
