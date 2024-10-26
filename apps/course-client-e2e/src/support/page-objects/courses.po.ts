export class CoursesPage {
  static goToPage() {
    cy.visit('/courses');
  }

  static seeCourse() {
    cy.get('[data-test=course]').should('be.visible');
  }
}
