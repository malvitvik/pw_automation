import {Locator, Page} from "@playwright/test";

export class OrderSummary {
    protected readonly page: Page;
    protected readonly orderNumber: Locator;
    protected readonly ctaOrderHistory: Locator;

    constructor(page: Page) {
        this.page = page;
        this.orderNumber = page.locator('label.ng-star-inserted');
        this.ctaOrderHistory = page.locator('td label[routerlink]');
    }
    
    async getOrderNumber() {
        return (await this.orderNumber.textContent()).replace(/\s?\|\s?/gi, "");
    }
    
    async openOrderHistory() {
        return this.ctaOrderHistory.click();
    }
}