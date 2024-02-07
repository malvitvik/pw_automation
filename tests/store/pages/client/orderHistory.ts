import {Locator, Page} from "@playwright/test";

export class OrderHistory {
    protected readonly page: Page;
    protected readonly orders: Locator;

    constructor(page: Page) {
        this.page = page;
        this.orders = page.locator('tr.ng-star-inserted');
    }
    
    async openOrder(orderNumber: string) {
        await this.orders.filter({ hasText: orderNumber }).getByRole('button').first().click();
    }
}