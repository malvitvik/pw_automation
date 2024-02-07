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
    }
    
    async addProductToCart(product:string|number) {
        
        let tile = typeof product === "string" ?
            this.productTiles.filter({ hasText: product }) : 
            this.productTiles.nth(product);
        
        let productName = await tile.locator('h5').textContent();
        await tile.getByRole('button', {name: 'Add To Cart'}).click();
        console.log(productName);
        return productName;
    }
}