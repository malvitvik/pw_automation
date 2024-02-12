import {Locator, Page, expect} from "@playwright/test";
import {Product} from "../models/product";

export  class ProductGrid {
    protected readonly productTiles: Locator;
    protected readonly noResultMessage: Locator;
    
    constructor(protected page: Page) {
        this.productTiles = page.locator('.products .product');
        this.noResultMessage = page.locator('.no-results');
    }
    
    async verifySearchResult(phrase: string) {
        expect(await this.productTiles.count()).toBeGreaterThanOrEqual(1); //at least one item
        let items = this.productTiles.filter({hasText: phrase});

        for (let item of await items.all()) {
            await expect.soft(item).toBeVisible()
        }
    }
    
    async verifyNoSearchResult() {
        await expect(this.noResultMessage).toBeVisible();
        await expect(this.noResultMessage).toContainText('Sorry, no products matched your search!');
        expect(await this.productTiles.all()).toHaveLength(0);
    }
    
    async addProductToCart(items: Product[]|string) {
       if (typeof items === "string")
           items = [new Product(items)];
        
        for (let product of items) {
            let tile = this.productTiles.filter({ hasText: product.name });
            let addToCartButton = tile.getByRole('button');
            
            await tile.locator('.quantity').fill('' + product.quantity);
            await addToCartButton.click();
            await expect.soft(addToCartButton).toHaveClass('added');
        }
    }
}