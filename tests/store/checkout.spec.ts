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

        await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
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
        await shoppingCart.applyCoupon(coupon);
        await shoppingCart.verifyCouponApplied(coupon);
        await shoppingCart.proceedToCheckout();
        await checkoutPage.placeOrder(country);
    });
});