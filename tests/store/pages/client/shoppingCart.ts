import {expect, Locator, Page} from "@playwright/test";
import {Product} from "../../models/product";

export class ShoppingCart {
    protected readonly page: Page;
    protected readonly cartItems: Locator;
    protected readonly ctaProceedToCheckout: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('.items');
        this.ctaProceedToCheckout = page.locator('.totalRow .btn-primary');
    }
    
    async verifyProducts(products: Product[]) {
        // await this.proceedToCheckoutButton.waitFor({ state: 'visible' });
        await this.cartItems.first().waitFor({ state: 'visible' });

        await expect(this.cartItems).toHaveCount(products.length);
        
        for (let product of products) {
            let tile = this.cartItems.filter({ hasText: product.name });
            
            await expect.soft(tile.locator('.itemImg')).toBeVisible();
            await expect.soft(tile.locator('h3')).toContainText(product.name);
        }
    }

    async proceedToCheckout() {
        await this.cartItems.first().waitFor({ state: 'visible' });
        await this.ctaProceedToCheckout.click();
    }
}