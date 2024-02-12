import {request, test as base} from '@playwright/test';
import {Product} from "./models/product";
import {CreditCard} from "./models/creditCard";
import {ApiUtils} from "./utils/api-utils";
import {headerFixtures, HeaderFixtures} from "./fixtures/client/header.fixtures";
import {productListingPageFixtures, ProductListingPageFixtures} from "./fixtures/client/productListingPage.fixtures";
import {shoppingCartPageFixtures, ShoppingCartPageFixtures} from "./fixtures/client/shoppingCart.fixtures";
import {checkoutFixtures, CheckoutFixtures} from "./fixtures/client/checkout.fixtures";
import {orderSummaryFixtures, OrderSummaryFixtures} from "./fixtures/client/orderSummary.fixtures";
import {orderHistoryFixtures, OrderHistoryFixtures} from "./fixtures/client/orderHistory.fixtures";
import {orderDetailsFixtures, OrderDetailsFixtures} from "./fixtures/client/orderDetails.fixtures";

const test = base.extend<HeaderFixtures &
    ProductListingPageFixtures & ShoppingCartPageFixtures & CheckoutFixtures &
    OrderSummaryFixtures & OrderHistoryFixtures & OrderDetailsFixtures>({
    ...headerFixtures,
    ...productListingPageFixtures,
    ...shoppingCartPageFixtures,
    ...checkoutFixtures,
    ...orderSummaryFixtures,
    ...orderHistoryFixtures,
    ...orderDetailsFixtures
});

test.describe('Client API tests', async () => {
    
    let apiUtils : ApiUtils;
    
    let apiResponse = {token:undefined, orderNumber:undefined};

    const creditCard = new CreditCard('Test', '4111 1111 1111 1111', '05/2025', '000');
    const country = 'India';
    const coupon = 'rahulshettyacademy';
    
    const loginPayload = {userEmail: "user_549@email.com", userPassword: "Qwerty123"};
    const orderPayload = {orders: [{country: 'Cuba', productOrderedId:  '6581ca399fd99c85e8ee7f45'}]};

    
    test.beforeAll(async () => {
        apiUtils = new ApiUtils(await request.newContext());
        apiResponse.token = await apiUtils.getToken(loginPayload);
        apiResponse.orderNumber = await apiUtils.placeOrder(orderPayload, apiResponse.token);
    });
    
    test.beforeEach(async ({ page}) => {
        await page.addInitScript(value => 
            window.localStorage.setItem('token', value),
            apiResponse.token);

        await page.goto('/client/');
    });
    
    test('UI - Place order with registered user', async ({ header, plp, cart, checkout,
                                                             orderSummary, orderHistory, orderDetails }) => {
        const products = [new Product(await plp.addProductToCart(1))];

        await header.openShoppingCart();
        await cart.verifyProducts(products);
        await cart.proceedToCheckout();

        await checkout.verifyProducts(products);
        await checkout.verifyEmail(loginPayload.userEmail);
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
    
    test('API - Place order with registered user', async ({ header, orderHistory, orderDetails }) => {
        await header.openOrderHistory();
        await orderHistory.openOrder(apiResponse.orderNumber);
        await orderDetails.verifyOrder(apiResponse.orderNumber);
    })
});