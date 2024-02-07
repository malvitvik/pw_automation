import {test, expect} from '@playwright/test';
import {Header} from "./pages/header/header";
import {ProductGrid} from "./pages/productGrid";

test.describe('Product search tests', async () => {
    let header : Header;
    let productGrid: ProductGrid;

    test.beforeEach(async ({page}) => {
        header = new Header(page);
        productGrid = new ProductGrid(page);
        
        await page.goto('/seleniumPractise/#/');
    });
    
    const products = ['Brocolli', 'Beetroot', 'Pumpkin'];
    
    for (let product of products) {
        test(`Search for [${product}] item`, async() => {
            await header.search(product);
            await productGrid.verifySearchResult(product);
        });
    }

    test(`Search for product description`, async() => {
        let phrase = '1/4 Kg';
        await header.search(phrase);
        await productGrid.verifySearchResult(phrase);
    });
    
    test('No Search result', async () => {
        await header.search("no-result");
        await productGrid.verifyNoSearchResult();
    });
});