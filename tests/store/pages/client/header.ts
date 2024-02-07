import {expect, Locator, Page} from "@playwright/test";


export class Header {
    protected readonly page: Page;
    //shopping cart
    protected readonly cartIcon: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.cartIcon = page.getByRole('button', { name: ' Cart' });
    }
    
    async openShoppingCart() {
        await this.cartIcon.click();
    }
}