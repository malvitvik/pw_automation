Feature: Ecommerce validations

	@E2E
	Scenario: Place an order
		Given I am logged in with "user_592@email.com" and "Qwerty123"
		When I add "Zara Coat 4" to Cart
			Then Cart have items
		When I place an order with valid data
			Then Order is placed
		
	@Validation
	Scenario Outline: Place an order
		Given I am logged in with "<username>" and "<password>"
		Then I see error on login page

		Examples:
		| username 			 | password  |
		| user@email.com 	 | Qwerty123 |
		| user_592@email.com | Qwertyqwe |