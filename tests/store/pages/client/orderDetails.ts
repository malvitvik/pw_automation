import {expect, Locator, Page} from "@playwright/test";
import {Product} from "../../models/product";

export class OrderDetails {
    protected readonly page: Page;
    protected readonly orderNumber: Locator;
    protected readonly productCards: Locator;
    protected readonly notAuthorizedMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.orderNumber = page.locator('.col-text');
        this.productCards = page.locator('.artwork-card');
        this.notAuthorizedMessage = page.locator('.row p');
    }
    
    async verifyOrder(orderNumber: string, products?: Array<Product>) {
        await expect(this.orderNumber).toHaveText(orderNumber);
        
        if (products === undefined) return;
        
        await expect.soft(this.productCards).toHaveCount(products.length);
        
        for (let product of products) {
            let card = this.productCards.filter({ hasText: product.name });
            
            await expect.soft(card.locator(".artwork-card-image")).toBeVisible();
            await expect.soft(card.locator(".title")).toHaveText(orderNumber);
        }

    }
    async verifyNotAuthorized() {
        await expect.soft(this.notAuthorizedMessage).toHaveClass('blink_me');
        await expect.soft(this.notAuthorizedMessage).toHaveText('You are not authorize to view this order');
    }
}