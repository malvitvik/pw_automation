import {test as base} from '@playwright/test';
import {Columns} from "./models/columns";
import {getKeys} from "../../utils/helper";
import {SortingOrder} from "./models/sortingOrder";
import {OffersPageFixtures, offersPageFixtures} from "./fixtures/offers/offersPage.fixtures";

const test = base.extend<OffersPageFixtures>({
    ...offersPageFixtures
});

test.describe('Offers', async () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/seleniumPractise/#/offers'); 
    });

    const products = ['Carrot', 'Potato', 'Tomato'];

    for (let product of products) {
        test(`Search [${product}] offer`, async ({ offersPage }) => {
            await offersPage.verifyItemsAmount();
            await offersPage.search(product);
            await offersPage.verifyItemsAmount('1');
        });
    }

    for (let columnIndex of getKeys(Columns).map(v => +v)) {
        test(`Sort items by ${Columns[columnIndex]} ASC`, async ({ offersPage }) => {
            let itemNames = await offersPage.getItemNames();

            await offersPage.sortBy(columnIndex);
            await offersPage.verifyChanged(itemNames);
            await offersPage.verifySorted(columnIndex);
        });
    }

    for (let columnIndex of getKeys(Columns).map(v => +v)) {
        test(`Sort items by ${Columns[columnIndex]} DESC`, async ({ offersPage }) => {
            //items are sorted by name DESC by default
            if (columnIndex == Columns.name)
                await offersPage.sortBy(Columns.price, SortingOrder.Asc);
            
            let itemNames = await offersPage.getItemNames();

            await offersPage.sortBy(columnIndex, SortingOrder.Desc);
            await offersPage.verifyChanged(itemNames);
            await offersPage.verifySorted(columnIndex, SortingOrder.Desc);
        });
    }
    
    test("Change items size", async ({ offersPage }) => {
        const amounts = await offersPage.getItemsPerPage();

        for (let amount of amounts) {
            await offersPage.itemsAmount(amount);
            await offersPage.verifyItemsAmount(amount); 
        }
    });
    
    test("Select date in calendar", async ({ offersPage }) => {
        const date = { month: "6", day: "15", year: "2030" }; //M D YYYY
        
        await offersPage.selectDate(date);
        await offersPage.verifyDate(date);
    })
});