import {test as base} from '@playwright/test';
 
import {Product} from "./models/product";
import {
    HeaderFixtures,
    headerFixtures
} from "./fixtures/header.fixtures";
import {
    ProductFixtures,
    productFixtures
} from "./fixtures/productFixtures";
import {
    CheckoutFixtures,
    checkoutFixtures
} from "./fixtures/checkout.fixtures";

const test = base.extend<HeaderFixtures & ProductFixtures & CheckoutFixtures>({
    ...headerFixtures,
    ...productFixtures,
    ...checkoutFixtures
    
});
test.describe('Checkout flow', async () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/seleniumPractise/#/');
    });
    
    test('E2E test: Place order', async ({header, productGrid, cart,checkoutPage}) => {
        const products = [new Product('Brocolli'), new Product('Beetroot'), new Product('Pumpkin', 2)];
        const coupon = 'rahulshettyacademy';
        const country = 'United Kingdom';
        
        await header.verifyCartIsEmpty();
        await productGrid.addProductToCart(products);
        await header.verifyCartHasProducts(products);
        
        await header.openShoppingCart();
        await cart.verifyProducts(products);
        await cart.verifyOrderSummary();
        await cart.applyCoupon(coupon);
        await cart.verifyCouponApplied(coupon);
        await cart.proceedToCheckout();
        await checkoutPage.placeOrder(country);
        await checkoutPage.verifyPlacedOrder();
    });
    
    test('Empty coupon code', async ({header, productGrid, cart}) => {
        await productGrid.addProductToCart('Beetroot');

        await header.openShoppingCart();
        await cart.applyCoupon('');
        await cart.verifyCouponError();
    });

    test('Invalid coupon code', async ({header, productGrid, cart}) => {
        let coupon = 'sadf';

        await productGrid.addProductToCart('Beetroot');

        await header.openShoppingCart();
        await cart.applyCoupon(coupon);
        await cart.verifyCouponError(coupon);
    });

    test('Order error', async ({header, productGrid, cart: cart, checkoutPage}) => {
        const country = 'United Kingdom';

        await productGrid.addProductToCart('Beetroot');

        await header.openShoppingCart();
        await cart.proceedToCheckout();
        await checkoutPage.placeOrder(country, false);
        await checkoutPage.verifyOrderError();
    });
});