import {Given, Then, When} from "@cucumber/cucumber";
import {Product} from "../../tests/store/models/product";
import {CreditCard} from "../../tests/store/models/creditCard";
import creditCardData from "../../test-data/creditCard.json";
import checkoutData from "../../test-data/checkout.json";

Given('I am logged in with "{string}" and "{string}"', async function (userEmail:string, password:string) {
    await this.poManager.loginPage.login({userEmail: userEmail, userPassword:password});
});

When('I add "{string}" to Cart', async function (product:string) {
    await this.poManager.plp.verifyOpened();
    this.products = [new Product(await this.poManager.plp.addProductToCart(product))];
});

When('I place an order with valid data', async function () {
    await this.poManager.cart.proceedToCheckout();

    await this.poManager.checkout.verifyProducts(this.products);
    await this.poManager.checkout.verifyEmail(this.userEmail);
    await this.poManager.checkout.shippingAddress(checkoutData.country);
    await this.poManager.checkout.selectCreditCardPayment();
    await this.poManager.checkout.creditCard().fill(new CreditCard(creditCardData));
    await this.poManager.checkout.applyCoupon(checkoutData.coupon);
    await this.poManager.checkout.verifyCouponApplied(checkoutData.coupon);
    await this.poManager.checkout.placeOrder();
});

Then('Cart have items', async function () {
    await this.poManager.header.openShoppingCart();
    await this.poManager.cart.verifyProducts(this.products);
});

Then('Order is placed', async function () {
    const orderNumber = await this.poManager.orderSummary.getOrderNumber();
    await this.poManager.orderSummary.openOrderHistory();
    await this.poManager.orderHistory.openOrder(orderNumber);
    await this.poManager.orderDetails.verifyOrder(orderNumber);
});