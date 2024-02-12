import {test as base} from '@playwright/test';
 
import {Product} from "./models/product";
import {
    HeaderFixtures,
    headerFixtures
} from "./fixtures/header.fixtures";
import {
    ProductGridFixtures,
    productGridFixtures
} from "./fixtures/productGrid.fixtures";
import {
    ShoppingCartFixtures,
    shoppingCartFixtures
} from "./fixtures/shoppingCart.fixtures";
import {
    CheckoutFixtures,
    checkoutFixtures
} from "./fixtures/checkout.fixtures";

const test = base.extend<HeaderFixtures & ProductGridFixtures & 
    ShoppingCartFixtures & CheckoutFixtures>({
    ...headerFixtures,
    ...productGridFixtures,
    ...shoppingCartFixtures, 
    ...checkoutFixtures
    
});
test.describe('Checkout flow', async () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/seleniumPractise/#/');
    });
    
    test('E2E test: Place order', async ({header, productGrid, shoppingCart,checkoutPage}) => {
        const products = [new Product('Brocolli'), new Product('Beetroot'), new Product('Pumpkin', 2)];
        const coupon = 'rahulshettyacademy';
        const country = 'United Kingdom';
        
        await header.verifyCartIsEmpty();
        await productGrid.addProductToCart(products);
        await header.verifyCartHasProducts(products);
        
        await header.openShoppingCart();
        await shoppingCart.verifyProducts(products);
        await shoppingCart.verifyOrderSummary();
        await shoppingCart.applyCoupon(coupon);
        await shoppingCart.verifyCouponApplied(coupon);
        await shoppingCart.proceedToCheckout();
        await checkoutPage.placeOrder(country);
        await checkoutPage.verifyPlacedOrder();
    });
    
    test('Empty coupon code', async ({header, productGrid, shoppingCart}) => {
        await productGrid.addProductToCart('Beetroot');

        await header.openShoppingCart();
        await shoppingCart.applyCoupon('');
        await shoppingCart.verifyCouponError();
    });

    test('Invalid coupon code', async ({header, productGrid, shoppingCart}) => {
        let coupon = 'sadf';

        await productGrid.addProductToCart('Beetroot');

        await header.openShoppingCart();
        await shoppingCart.applyCoupon(coupon);
        await shoppingCart.verifyCouponError(coupon);
    });

    test('Order error', async ({header, productGrid, shoppingCart, checkoutPage}) => {
        const country = 'United Kingdom';

        await productGrid.addProductToCart('Beetroot');

        await header.openShoppingCart();
        await shoppingCart.proceedToCheckout();
        await checkoutPage.placeOrder(country, false);
        await checkoutPage.verifyOrderError();
    });
});