import {Locator, Page} from "@playwright/test";


export class Header {
    protected readonly page: Page;
    //shopping cart
    protected readonly ctaCart: Locator;
    protected readonly ctaOrderHistory: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.ctaCart = page.getByRole('button', { name: ' Cart' });
        this.ctaOrderHistory = page.getByRole('button', { name: '  ORDERS' });
    }
    
    async openShoppingCart() {
        await this.ctaCart.click();
    }
    
    async openOrderHistory() {
        await this.ctaOrderHistory.click();
    }
}