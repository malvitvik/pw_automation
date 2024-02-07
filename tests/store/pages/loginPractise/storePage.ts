import {expect, Locator, Page} from "@playwright/test";

export class StorePage {
    protected readonly page: Page;
    protected readonly productItems : Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.productItems = page.locator('.card');
    }
    
    async verifyOpened() {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.productItems.first()).toBeVisible({timeout: 30_000});
    }
}