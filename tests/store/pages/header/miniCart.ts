import {expect, Locator, Page} from "@playwright/test";

export class MiniCart {
    protected readonly cartButton: Locator;
    protected readonly emptyCartMessage: Locator;

    constructor(protected page: Page) {
        this.cartButton = page.locator('.cart-preview button');
        this.emptyCartMessage = page.locator('.cart-preview .empty-cart');
    }
    
    async openShoppingCart() {
        await this.cartButton.click();
    }
    
    async verifyMiniCartIsEmpty() {
        await expect(this.emptyCartMessage).toBeVisible();
        await expect(this.cartButton).toBeDisabled();
    }
}