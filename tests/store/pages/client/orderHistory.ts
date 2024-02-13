import {expect, Locator, Page} from "@playwright/test";

export class OrderHistory {
    protected readonly page: Page;
    protected readonly noOrdersMessage: Locator;
    protected readonly orders: Locator;

    constructor(page: Page) {
        this.page = page;
        this.noOrdersMessage = page.locator('.mt-4');
        this.orders = page.locator('tr.ng-star-inserted');
    }
    
    async openOrder(orderNumber?: string) {
        let order = orderNumber === undefined ? 
            this.orders.first() :
            this.orders.filter({ hasText: orderNumber });
        
        await order.locator('button:has-text("View")').click();
    }
    
    async verifyIsEmpty() {
        await this.page.waitForResponse('/api/ecom/order/get-orders-for-customer/*');
        await expect.soft(this.orders).toHaveCount(0);
        await expect.soft(this.noOrdersMessage).toContainText('No Orders');
    }
}