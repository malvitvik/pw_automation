import {test as base} from '@playwright/test';
import {randomInt} from "./utils/helper";
import {Product} from "./models/product";
import {CreditCard} from "./models/creditCard";
import {HeaderFixtures, headerFixtures} from "./fixtures/client/header.fixtures";
import {registrationPageFixtures, RegistrationPageFixtures} from "./fixtures/client/registrationPage.fixtures";
import {loginPageFixtures, LoginPageFixtures} from "./fixtures/client/loginPage.fixtures";
import {productListingPageFixtures, ProductListingPageFixtures} from "./fixtures/client/productListingPage.fixtures";
import {shoppingCartPageFixtures, ShoppingCartPageFixtures} from "./fixtures/client/shoppingCart.fixtures";
import {orderSummaryFixtures, OrderSummaryFixtures} from "./fixtures/client/orderSummary.fixtures";
import {checkoutFixtures, CheckoutFixtures} from "./fixtures/client/checkout.fixtures";
import {orderHistoryFixtures, OrderHistoryFixtures} from "./fixtures/client/orderHistory.fixtures";
import {orderDetailsFixtures, OrderDetailsFixtures} from "./fixtures/client/orderDetails.fixtures";

const test = base.extend<HeaderFixtures & RegistrationPageFixtures & LoginPageFixtures &
    ProductListingPageFixtures & ShoppingCartPageFixtures & CheckoutFixtures & 
    OrderSummaryFixtures & OrderHistoryFixtures & OrderDetailsFixtures>({
    ...headerFixtures,
    ...registrationPageFixtures,
    ...loginPageFixtures,
    ...productListingPageFixtures,
    ...shoppingCartPageFixtures,
    ...checkoutFixtures,
    ...orderSummaryFixtures,
    ...orderHistoryFixtures,
    ...orderDetailsFixtures
});

test.describe('Client E2E tests', async () => {

    const creditCard = new CreditCard('Test', '4111 1111 1111 1111', '05/2025', '000');
    const country = 'India';
    const coupon = 'rahulshettyacademy';
    
    test.beforeEach(async ({page}) => {
        await page.goto('/client/');
    });

    test('E2E test - register user and place order', async({ header, loginPage, registrationPage, 
                                                               plp, cart, checkout,
                                                               orderSummary, orderHistory, orderDetails}) => {
        const no = ('000' + randomInt(1_000)).slice(-3);
        // const no = 549;
        const user = {firstName: `firstName${no}`, lastName: `lastName${no}`, gender: 'Male',
            email: `user_${no}@email.com`, phoneNumber:'3333333333', password:'Qwerty123', occupation: 'Doctor'};
        
        await loginPage.openRegistration();
        await registrationPage.registerUser(user);
        await registrationPage.verifyRegistered();
        await registrationPage.openLoginPage();

        await loginPage.login({userEmail: user.email, userPassword:user.password});
        
        await plp.verifyOpened();
        const products = [new Product(await plp.addProductToCart(1))];
        
        await header.openShoppingCart();
        await cart.verifyProducts(products);
        await cart.proceedToCheckout();
        
        await checkout.verifyProducts(products);
        await checkout.verifyEmail(user.email);
        await checkout.shippingAddress(country);
        await checkout.selectCreditCardPayment();
        await checkout.creditCard().fill(creditCard);
        await checkout.applyCoupon(coupon);
        await checkout.verifyCouponApplied(coupon);
        await checkout.placeOrder();
        
        const orderNumber = await orderSummary.getOrderNumber();
        await orderSummary.openOrderHistory();
        await orderHistory.openOrder(orderNumber);
        await orderDetails.verifyOrder(orderNumber);
    });
});