import {test as base} from '@playwright/test';
import {Product} from "./models/product";
import {HeaderFixtures, headerFixtures} from "./fixtures/client/header.fixtures";
import {productFixtures, ProductFixtures} from "./fixtures/client/productFixtures";
import {checkoutFixtures, CheckoutFixtures} from "./fixtures/client/checkout.fixtures";
import {orderFixtures, OrderFixtures} from "./fixtures/client/orderFixtures";
import {accountFixtures, AccountFixtures} from "./fixtures/client/account.fixture";
import {userFixtures, UserFixtures} from "./fixtures/client/userFixtures";
import checkoutData from "../../test-data/checkout.json";

const test = base.extend<UserFixtures & HeaderFixtures & 
    AccountFixtures & ProductFixtures & CheckoutFixtures & OrderFixtures>({
    ...userFixtures,
    ...headerFixtures,
    ...accountFixtures,
    ...productFixtures,
    ...checkoutFixtures,
    ...orderFixtures,
});

test.describe('Client E2E tests', async () => {

    test('@web E2E test - register user and place order', async({user, creditCard,
                                                               header, loginPage, registrationPage, 
                                                               plp, cart, checkout,
                                                               orderSummary, orderHistory, orderDetails}) => {
        await loginPage.goto();
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
        await checkout.shippingAddress(checkoutData.country);
        await checkout.selectCreditCardPayment();
        await checkout.creditCard().fill(creditCard);
        await checkout.applyCoupon(checkoutData.coupon);
        await checkout.verifyCouponApplied(checkoutData.coupon);
        await checkout.placeOrder();
        
        const orderNumber = await orderSummary.getOrderNumber();
        await orderSummary.openOrderHistory();
        await orderHistory.openOrder(orderNumber);
        await orderDetails.verifyOrder(orderNumber);
    });
});