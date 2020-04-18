import { getGreeting } from '../support/app.po';

describe('course-client', () => {
  beforeEach(() => cy.visit('/course'));

  it('should show lesson', () => {
    cy.contains('1. First lesson');
  });
});
