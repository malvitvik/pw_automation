import {test} from '@playwright/test';
import {Header} from "./pages/client/header";
import {LoginPage} from "./pages/client/loginPage";
import {ProductListingPage} from "./pages/client/productListingPage";
import {ShoppingCart} from "./pages/client/shoppingCart";
import {CheckoutPage} from "./pages/client/checkoutPage";
import {OrderSummary} from "./pages/client/orderSummary";
import {OrderHistory} from "./pages/client/orderHistory";
import {OrderDetails} from "./pages/client/orderDetails";
import {CreditCard} from "./models/creditCard";
import {Product} from "./models/product";
import {BrowserContext} from "playwright-core";

test.describe('client storage', async () => {

    let webContext: BrowserContext;
    
    let header: Header;
    let plp: ProductListingPage;
    let cart: ShoppingCart;
    let checkout: CheckoutPage;
    let orderSummary: OrderSummary;
    let orderHistory: OrderHistory;
    let orderDetails: OrderDetails;

    const loginPayload = {userEmail: "user_549@email.com", userPassword: "Qwerty123"};
    const creditCard = new CreditCard('Test', '4111 1111 1111 1111', '05/2025', '000');
    const country = 'India';
    const coupon = 'rahulshettyacademy';
    
    test.beforeAll(async ({browser}) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto('/client/');
        await new LoginPage(page).login(loginPayload);
        await page.waitForLoadState("networkidle");
        await context.storageState({ path: 'state.json' });
        await page.close();
        
        webContext = await browser.newContext({storageState: 'state.json'});
    });

    test.beforeEach(async () => {
        const page = await webContext.newPage();
        header = new Header(page);
        plp = new ProductListingPage(page);
        cart = new ShoppingCart(page);
        checkout = new CheckoutPage(page);
        orderSummary = new OrderSummary(page);
        orderHistory = new OrderHistory(page);
        orderDetails = new OrderDetails(page);

        await page.goto('/client/');
    });

    test('Storage - place order', async() => {

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
});