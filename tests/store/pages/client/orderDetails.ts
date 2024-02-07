import {expect, Locator, Page} from "@playwright/test";
import {Product} from "../../models/product";

export class OrderDetails {
    protected readonly page: Page;
    protected readonly orderNumber: Locator;
    protected readonly productCards: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.orderNumber = page.locator('.col-text');
        this.productCards = page.locator('.artwork-card');
    }
    
    async verifyOrder(orderNumber: string, products?: Array<Product>) {
        await expect(this.orderNumber).toHaveText(orderNumber);
        
        if (products === undefined) return;
        
        expect.soft(this.productCards.all()).toHaveLength(products.length);
        
        for (let product of products) {
            let card = this.productCards.filter({ hasText: product.name });
            
            await expect.soft(card.locator(".artwork-card-image")).toBeVisible();
            await expect.soft(card.locator(".title")).toHaveText(orderNumber);
        }

    }
}