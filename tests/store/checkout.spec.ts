import {test, expect} from '@playwright/test';
import {Header} from "./pages/header/header";
import {ProductGrid} from "./pages/productGrid";
import {ShoppingCart} from "./pages/checkout/shoppingCart";
import {CheckoutPage} from "./pages/checkout/checkoutPage";
import {Product} from "./models/product";

test.describe('Checkout flow', async () => {
    let header : Header;
    let productGrid: ProductGrid;
    let shoppingCart: ShoppingCart;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({page}) => {
        header = new Header(page);
        productGrid = new ProductGrid(page);
        shoppingCart = new ShoppingCart(page);
        checkoutPage = new CheckoutPage(page);

        await page.goto('/seleniumPractise/#/');
    });
    
    test('E2E test: Place order', async () => {
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
    
    test('Empty coupon code', async () => {
        await productGrid.addProductToCart('Beetroot');

        await header.openShoppingCart();
        await shoppingCart.applyCoupon('');
        await shoppingCart.verifyCouponError();
    });

    test('Invalid coupon code', async () => {
        let coupon = 'sadf';

        await productGrid.addProductToCart('Beetroot');

        await header.openShoppingCart();
        await shoppingCart.applyCoupon(coupon);
        await shoppingCart.verifyCouponError(coupon);
    });

    test('Order error', async () => {
        const country = 'United Kingdom';

        await productGrid.addProductToCart('Beetroot');

        await header.openShoppingCart();
        await shoppingCart.proceedToCheckout();
        await checkoutPage.placeOrder(country, false);
        await checkoutPage.verifyOrderError();
    });
});