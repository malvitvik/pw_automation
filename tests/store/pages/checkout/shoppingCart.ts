import {expect, Locator, Page} from "@playwright/test";
import {Product} from "../../models/product";

export class ShoppingCart {
    protected readonly page: Page;
    protected readonly cartItems: Locator;
    protected readonly promoField: Locator;
    protected readonly promoMessage: Locator;
    protected readonly applyPromoButton: Locator;
    protected readonly proceedToCheckoutButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('.products tbody tr');
        this.promoField = page.locator('.promoCode');
        this.promoMessage = page.locator('.promoInfo');
        this.applyPromoButton = page.locator('.promoBtn');
        this.proceedToCheckoutButton = page.getByRole('button').last();
    }
    
    async verifyProducts(products: Array<Product>) {
        // await this.proceedToCheckoutButton.waitFor({ state: 'visible' });
        await this.cartItems.first().waitFor({ state: 'visible' });

        expect(await this.cartItems.all()).toHaveLength(products.length);
        
        for (let product of products) {
            let tile = this.cartItems.filter({ hasText: product.name });
            let prices = tile.locator('.amount'); //item and total price
            
            await expect.soft(tile.locator('.product-image')).toBeVisible();
            await expect.soft(tile.locator('.product-name')).toContainText(product.name);
            await expect.soft(tile.locator('.quantity')).toHaveText('' + product.quantity);
            await expect.soft(prices.first()).toBeVisible();
            await expect.soft(prices.last()).toBeVisible();
            
            let total = product.quantity * +await prices.first().textContent();
            await expect.soft(prices.last()).toHaveText('' + total);
        }
    }

    async applyCoupon(coupon:string) {
        await this.promoField.fill(coupon);
        await this.applyPromoButton.click();
    }

    async verifyCouponApplied(coupon:string) {
        await this.applyPromoButton.locator('.promo-btn-loader').waitFor({ state: 'detached' });
        await expect.soft(this.promoField).toHaveValue(coupon);
        await expect.soft(this.promoMessage).toHaveText('Code applied ..!');
        await expect.soft(this.promoMessage).toHaveCSS('color', 'rgb(0, 128, 0)');
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }
}