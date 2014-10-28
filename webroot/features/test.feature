Feature: Page Check
  In order to make sure my site is working
  As a user
  I need to see grunt on the page

  @javascript
  Scenario: Searching for "behat"
    Given I go to "http://grunt.danmac.com"
    Then I should see "grunt"

