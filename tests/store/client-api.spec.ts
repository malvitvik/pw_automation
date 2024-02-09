import {test, request, expect} from '@playwright/test';
import {ProductListingPage} from "./pages/client/productListingPage";
import {ShoppingCart} from "./pages/client/shoppingCart";
import {CheckoutPage} from "./pages/client/checkoutPage";
import {OrderSummary} from "./pages/client/orderSummary";
import {OrderHistory} from "./pages/client/orderHistory";
import {OrderDetails} from "./pages/client/orderDetails";
import {Product} from "./models/product";
import {CreditCard} from "./models/creditCard";
import {Header} from "./pages/client/header";
import {ApiUtils} from "./utils/api-utils";

test.describe('Client API tests', async () => {

    let header: Header;
    let plp: ProductListingPage;
    let cart: ShoppingCart;
    let checkout: CheckoutPage;
    let orderSummary: OrderSummary;
    let orderHistory: OrderHistory;
    let orderDetails: OrderDetails;
    
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
        header = new Header(page);
        plp = new ProductListingPage(page);
        cart = new ShoppingCart(page);
        checkout = new CheckoutPage(page);
        orderSummary = new OrderSummary(page);
        orderHistory = new OrderHistory(page);
        orderDetails = new OrderDetails(page);
        
        await page.addInitScript(value => 
            window.localStorage.setItem('token', value),
            apiResponse.token);

        await page.goto('/client/');
    });
    
    test('UI - Place order with registered user', async () => {
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
    
    test('API - Place order with registered user', async () => {
        await header.openOrderHistory();
        await orderHistory.openOrder(apiResponse.orderNumber);
        await orderDetails.verifyOrder(apiResponse.orderNumber);
    })
});