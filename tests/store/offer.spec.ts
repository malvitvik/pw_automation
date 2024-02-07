import {test} from '@playwright/test';
import {OffersPage} from "./pages/offers/offersPage";
import {Columns} from "./models/columns";
import {getKeys} from "./models/helper";
import {SortingOrder} from "./models/sortingOrder";

test.describe('Offers', async () => {
    
    let offersPage: OffersPage;
    
    test.beforeEach(async ({ page }) => {
        offersPage = new OffersPage(page);
        
        await page.goto('/seleniumPractise/#/offers'); 
    });

    const products = ['Carrot', 'Potato', 'Tomato'];

    for (let product of products) {
        test(`Search [${product}] offer`, async () => {
            await offersPage.verifyItemsAmount();
            await offersPage.search(product);
            await offersPage.verifyItemsAmount('1');
        });
    }

    for (let columnIndex of getKeys(Columns).map(v => +v)) {
        test(`Sort items by ${Columns[columnIndex]} ASC`, async () => {
            let itemNames = await offersPage.getItemNames();

            await offersPage.sortBy(columnIndex);
            await offersPage.verifyChanged(itemNames);
            await offersPage.verifySorted(columnIndex);
        });
    }

    for (let columnIndex of getKeys(Columns).map(v => +v)) {
        test(`Sort items by ${Columns[columnIndex]} DESC`, async () => {
            //items are sorted by name DESC by default
            if (columnIndex == Columns.name)
                await offersPage.sortBy(Columns.price, SortingOrder.Asc);
            
            let itemNames = await offersPage.getItemNames();

            await offersPage.sortBy(columnIndex, SortingOrder.Desc);
            await offersPage.verifyChanged(itemNames);
            await offersPage.verifySorted(columnIndex, SortingOrder.Desc);
        });
    }
    
    test("Change items size", async () => {
        const amounts = await offersPage.getItemsPerPage();

        for (let amount of amounts) {
            await offersPage.itemsAmount(amount);
            await offersPage.verifyItemsAmount(amount); 
        }
    })
});