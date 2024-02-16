Feature: Ecommerce validations

	Scenario: Place an order
		Given I am logged in with "username" and "password"
		When I add "Zara Coat 4" to Cart
			Then Cart have items
		When I place an order with valid data
			Then Order is placed