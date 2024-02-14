import {request, test as base} from '@playwright/test';
import {Product} from "./models/product";
import {CreditCard} from "./models/creditCard";
import {ApiUtils} from "../../utils/api-utils";
import {headerFixtures, HeaderFixtures} from "./fixtures/client/header.fixtures";
import {productFixtures, ProductFixtures} from "./fixtures/client/productFixtures";
import {checkoutFixtures, CheckoutFixtures} from "./fixtures/client/checkout.fixtures";
import {orderFixtures, OrderFixtures} from "./fixtures/client/orderFixtures";
import {accountFixtures, AccountFixtures} from "./fixtures/client/account.fixture";
import creditCardData from "../../test-data/creditCard.json";
import checkoutData from "../../test-data/checkout.json";
import loginPayload from "../../test-data/payLoads/loginPayload.json";
import orderPayload from "../../test-data/payLoads/orderPayload.json";
import fakePayLoadOrders from "../../test-data/payLoads/fakePayLoadOrders.json";

const test = base.extend<HeaderFixtures & 
    AccountFixtures & ProductFixtures & CheckoutFixtures & OrderFixtures>({
    ...headerFixtures,
    ...accountFixtures,
    ...productFixtures,
    ...checkoutFixtures,
    ...orderFixtures
});

//--grep @api
test.describe('Client API tests', async () => {
    
    let apiUtils : ApiUtils;
    
    let apiResponse = {token:undefined, orderNumber:undefined};
    const creditCard = new CreditCard(creditCardData);

    
    test.beforeAll(async () => {
        apiUtils = new ApiUtils(await request.newContext());
        apiResponse.token = await apiUtils.getToken(loginPayload);
        apiResponse.orderNumber = await apiUtils.placeOrder(orderPayload, apiResponse.token);
    });
    
    test.beforeEach(async ({ page, loginPage}) => {
        await page.addInitScript(value => 
            window.localStorage.setItem('token', value),
            apiResponse.token);

        await loginPage.goto();
    });
    
    test('@web Place order with registered user', async ({ header, plp, cart, checkout,
                                                             orderSummary, orderHistory, orderDetails }) => {
        const products = [new Product(await plp.addProductToCart(1))];

        await header.openShoppingCart();
        await cart.verifyProducts(products);
        await cart.proceedToCheckout();

        await checkout.verifyProducts(products);
        await checkout.verifyEmail(loginPayload.userEmail);
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
    
    test('@api Place order with registered user', async ({ header, orderHistory, orderDetails }) => {
        await header.openOrderHistory();
        await orderHistory.openOrder(apiResponse.orderNumber);
        await orderDetails.verifyOrder(apiResponse.orderNumber);
    });

    test('@api No order', async ({ page, header, orderHistory}) => {
        await page.route('/api/ecom/order/get-orders-for-customer/*', async route => {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayLoadOrders);
            
            await route.fulfill({ 
                response,
                body
            });
            
        });
        await header.openOrderHistory();
        await orderHistory.verifyIsEmpty();
    });
    
    test('@api User is not authorized to see other orders', async ({ page, header , orderHistory, orderDetails}) => {
        await page.route('/api/ecom/order/get-orders-details?id=*', 
                route => route.continue({url: page.url().replace(/id=.*/g, 'id=1234567890')}));
        
        await header.openOrderHistory();
        await orderHistory.openOrder();
        await orderDetails.verifyNotAuthorized();
    });
});