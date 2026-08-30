Feature: Course client login

  Scenario: Anonymous user opens the protected courses page
    Given I am not authenticated in the course client
    When I open the protected course client courses page
    Then the course client login page is shown
