export class CourseAdminPage {
  static goToPage() {
    cy.visit('/course-admin');
  }

  static seeSections() {
    cy.get('[data-test=section]').should('be.visible');
  }
}
