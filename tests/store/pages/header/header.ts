import {expect, Locator, Page} from "@playwright/test";
import {MiniCart} from "./miniCart";
import {Product} from "../../models/product";

export class Header {
    //search
    protected readonly searchFiled: Locator;
    protected readonly searchButton: Locator;
    //shopping cart
    protected readonly cartIcon: Locator;
    protected readonly cartInfo: Locator;
    protected readonly miniCart: MiniCart;
    
    constructor(protected page: Page) {
        this.searchFiled = page.locator('.search-keyword');
        this.searchButton = page.locator('.search-button');
        this.cartIcon = page.locator('.cart-icon');
        this.cartInfo = page.locator('.cart-info td:last-child');
        this.miniCart = new MiniCart(page);
    }
    
    async search(phrase: string) {
        await this.searchFiled.fill(phrase);
        await this.searchButton.click();
    }
    
    async openShoppingCart() {
        await this.cartIcon.click();
        await this.miniCart.openShoppingCart();
    }
    
    async verifyCartIsEmpty() {
        await expect.soft(this.cartInfo.first()).toHaveText('0');
        await expect.soft(this.cartInfo.last()).toHaveText('0');
    }
    
    async verifyCartHasProducts(items: Array<Product>) {
        await expect.soft(this.cartInfo.first()).toHaveText(''+ items.length);
        await expect.soft(this.cartInfo.last()).not.toHaveText('0');
    }
}