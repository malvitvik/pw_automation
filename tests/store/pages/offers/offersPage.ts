import {expect, Locator, Page} from "@playwright/test";
import {Columns} from "../../models/columns";
import {SortingOrder} from "../../models/sortingOrder";

export class OffersPage {
    protected readonly searchField: Locator;
    protected readonly pageMenu: Locator;
    protected readonly pagination: Locator;
    protected readonly columnHeaders: Locator;
    protected readonly menuItems: Locator;
    protected readonly itemNames: Locator;
    
    constructor(protected page: Page) {
        this.searchField = page.locator('#search-field');
        this.pageMenu = page.locator('#page-menu');
        this.pagination = page.locator('.pagination a[role="button"]');
        this.columnHeaders = page.getByRole('columnheader');
        this.menuItems = page.locator('tbody tr');
        this.itemNames = this.menuItems.locator('xpath=./td[1]');
    }
    
    async search(phrase:string) {
        await this.searchField.fill(phrase);
    }
    
    async itemsAmount(amount: string) {
        await this.pageMenu.selectOption(amount);
        await expect(this.pageMenu).toHaveValue(amount);
    }
    
    async verifyItemsAmount(amount: string = '-1') {
        await this.page.waitForLoadState('networkidle');

        if (amount === '-1')
            amount = await this.pageMenu.inputValue();

        let number = await this.pagination.count();
        if (number == 5) {
            expect(await this.menuItems.count()).toBeLessThanOrEqual(+amount);
        } else {
            expect(await this.menuItems.all()).toHaveLength(+amount);
        }
    }
    
    async getItemsPerPage() {
        return await this.pageMenu.locator('option').allTextContents();
    }
    
    async getItemNames() {
          return await this.getColumn(Columns.name);
    }

    private async getColumn(column:Columns) {
        await this.page.waitForLoadState('networkidle');
        //0 based index to 1 based
        return await this.menuItems.locator(`xpath=./td[${column + 1}]`).allTextContents();
    }

    async sortBy(column: Columns, order: SortingOrder = SortingOrder.Asc) {
        let header = this.columnHeaders.nth(column);
        
        let orderLength = 3; //none, ascending, descending
        for (let i = 0; 
             await header.getAttribute('aria-sort') != order && i < orderLength; 
             i++) {
            await this.page.waitForLoadState('networkidle');
            await header.click();
        }
    }
    
    async verifyChanged(oldItemNames:string[]) {
        await this.page.waitForLoadState('networkidle');
        await expect(this.itemNames).not.toHaveText(oldItemNames);
    }
    
    async verifySorted(column: Columns, order: SortingOrder = SortingOrder.Asc) {
        
        let comparingFn:(a:string, b:string) => number;
        
        if (column == Columns.name) {
            comparingFn = SortingOrder.Asc == order ? 
                (a:string, b:string) => a.localeCompare(b) : 
                (a:string, b:string) => b.localeCompare(a);
        } else {
            comparingFn =  SortingOrder.Asc == order ?
                (a:string, b:string) => +a - +b :
                (a:string, b:string) => +b - +a;
        }

        await this.page.waitForLoadState('networkidle');
        
        let items = await this.getColumn(column);
        let sortedItems = Object.assign([], items).sort(comparingFn);
        
        expect(items).toEqual(sortedItems);
    }
}