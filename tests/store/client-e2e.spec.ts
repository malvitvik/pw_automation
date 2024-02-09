import {test} from '@playwright/test';
import {LoginPage} from "./pages/client/loginPage";
import {RegistrationPage} from "./pages/client/registrationPage";
import {ProductListingPage} from "./pages/client/productListingPage";
import {Header} from "./pages/client/header";
import {ShoppingCart} from "./pages/client/shoppingCart";
import {CheckoutPage} from "./pages/client/checkoutPage";
import {randomInt} from "./utils/helper";
import {Product} from "./models/product";
import {CreditCard} from "./models/creditCard";
import {OrderSummary} from "./pages/client/orderSummary";
import {OrderHistory} from "./pages/client/orderHistory";
import {OrderDetails} from "./pages/client/orderDetails";

test.describe('Client tests', async () => {
    
    let header: Header;
    let registrationPage: RegistrationPage;
    let loginPage: LoginPage;
    let plp: ProductListingPage;
    let cart: ShoppingCart;
    let checkout: CheckoutPage;
    let orderSummary: OrderSummary;
    let orderHistory: OrderHistory;
    let orderDetails: OrderDetails;
    
    test.beforeEach(async ({page}) => {
        header = new Header(page);
        registrationPage = new RegistrationPage(page);
        loginPage = new LoginPage(page);
        plp = new ProductListingPage(page);
        cart = new ShoppingCart(page);
        checkout = new CheckoutPage(page);
        orderSummary = new OrderSummary(page);
        orderHistory = new OrderHistory(page);
        orderDetails = new OrderDetails(page);
        
        await page.goto('/client/');
    });

    test('E2E test - registered user', async() => {
        const no = ('000' + randomInt(1_000)).slice(-3);
        // const no = 549;
        const user = {firstName: `firstName${no}`, lastName: `lastName${no}`, gender: 'Male',
            email: `user_${no}@email.com`, phoneNumber:'3333333333', password:'Qwerty123', occupation: 'Doctor'};
        const creditCard = new CreditCard('Test', '4111 1111 1111 1111', '05/2025', '000');
        const country = 'India';
        const coupon = 'rahulshettyacademy';
        
        
        await loginPage.openRegistration();
        await registrationPage.registerUser(user);
        await registrationPage.verifyRegistered();
        await registrationPage.openLoginPage();

        await loginPage.login({username: user.email, password:user.password});
        
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