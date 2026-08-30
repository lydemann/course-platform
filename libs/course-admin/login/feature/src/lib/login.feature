Feature: Course admin login

  Scenario: Anonymous user opens the protected courses page
    Given I am not authenticated in course admin
    When I open the protected course admin courses page
    Then the course admin login page is shown
