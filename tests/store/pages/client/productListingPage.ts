import {expect, Locator, Page} from "@playwright/test";

export class ProductListingPage {
    protected readonly page: Page;
    protected readonly productTiles : Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.productTiles = page.locator('.card-body');
    }
    
    async verifyOpened() {
        let tile = this.productTiles.first();
        await expect(tile).toBeVisible();
        console.log(await tile.locator('h5').textContent());
    }
}