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
import creditCardData from "../../test-data/creditCard.json";
import checkoutData from "../../test-data/checkout.json";
import loginPayload from "../../test-data/payLoads/loginPayload.json";
import {PoManager} from "./pages/poManager";

test.describe('client storage', async () => {

    let webContext: BrowserContext;
    
    let poManager : PoManager;

    const creditCard = new CreditCard(creditCardData);
    
    test.beforeAll(async ({browser}) => {
        const context = await browser.newContext();
        poManager = new PoManager(await context.newPage());
        
        await poManager.loginPage.goto();
        await poManager.loginPage.login(loginPayload);

        await poManager.page.waitForLoadState("networkidle");
        await context.storageState({ path: 'state.json' });
        await poManager.page.close();
        
        webContext = await browser.newContext({storageState: 'state.json'});
    });

    test.beforeEach(async () => {
        poManager = new PoManager(await webContext.newPage());
        await poManager.loginPage.goto();
    });

    test('Storage - place order', async() => {

        const products = [new Product(await poManager.plp.addProductToCart(1))];

        await poManager.header.openShoppingCart();
        await poManager.cart.verifyProducts(products);
        await poManager.cart.proceedToCheckout();

        await poManager.checkout.verifyProducts(products);
        await poManager.checkout.verifyEmail(loginPayload.userEmail);
        await poManager.checkout.shippingAddress(checkoutData.country);
        await poManager.checkout.selectCreditCardPayment();
        await poManager.checkout.creditCard().fill(creditCard);
        await poManager.checkout.applyCoupon(checkoutData.coupon);
        await poManager.checkout.verifyCouponApplied(checkoutData.coupon);
        await poManager.checkout.placeOrder();

        const orderNumber = await poManager.orderSummary.getOrderNumber();
        await poManager.orderSummary.openOrderHistory();
        await poManager.orderHistory.openOrder(orderNumber);
        await poManager.orderDetails.verifyOrder(orderNumber);
    });
});