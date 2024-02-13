import {test as base} from "playwright/types/test";
import {headerFixtures, HeaderFixtures} from "./fixtures/header.fixtures";
import {productGridFixtures, ProductGridFixtures} from "./fixtures/productGrid.fixtures";


const test = base.extend<HeaderFixtures & ProductGridFixtures>({
    ...headerFixtures,
    ...productGridFixtures

});

test.describe('Product search tests', async () => {


    test.beforeEach(async ({page}) => {
        await page.goto('/seleniumPractise/#/');
    });
    
    const products = ['Brocolli', 'Beetroot', 'Pumpkin'];
    
    for (let product of products) {
        test(`Search for [${product}] item`, async({header, productGrid}) => {
            await header.search(product);
            await productGrid.verifySearchResult(product);
        });
    }

    test(`Search for product description`, async({header, productGrid}) => {
        let phrase = '1/4 Kg';
        await header.search(phrase);
        await productGrid.verifySearchResult(phrase);
    });
    
    test('No Search result', async ({header, productGrid}) => {
        await header.search("no-result");
        await productGrid.verifyNoSearchResult();
    });
});