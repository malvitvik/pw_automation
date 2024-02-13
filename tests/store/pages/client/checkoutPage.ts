import {expect, Locator, Page} from "@playwright/test";
import {Product} from "../../models/product";
import {CreditCardWidget} from "./widgets/creditCardWidget";

export class CheckoutPage {
    protected readonly page: Page;
    protected readonly cartItems: Locator;
    protected readonly edtEmail: Locator;
    protected readonly edtCountryAutocomplete: Locator;
    protected readonly countrySuggestions: Locator;
    protected readonly paymentSelector: Locator;
    protected readonly edtCoupon: Locator;
    protected readonly ctaApplyCoupon: Locator;
    protected readonly couponMessage: Locator;
    protected readonly ctaPlaceOrder: Locator;
    protected readonly creditCardWidget: CreditCardWidget;
    
    constructor(page: Page) {
        this.page = page;
        this.creditCardWidget = new CreditCardWidget(page);
        this.edtEmail = page.locator('.user__name input[type="text"]');
        this.edtCountryAutocomplete = page.locator('[placeholder="Select Country"]');
        this.countrySuggestions = page.locator('.ta-results');
        this.paymentSelector = page.locator('.payment__types');
        this.edtCoupon = page.locator('[name="coupon"]');
        this.ctaApplyCoupon = page.locator('[type="submit"]');
        this.couponMessage = page.locator('[name="coupon"] + p');
        this.ctaPlaceOrder = page.locator('.actions a');
        this.cartItems = page.locator('.item__details');
    }
    
    creditCard(){
        return this.creditCardWidget;
    }
    
    async verifyProducts(products : Array<Product>) {
        await this.cartItems.first().waitFor({ state: 'visible' });

        await expect(this.cartItems).toHaveCount(products.length);

        for (let product of products) {
            let tile = this.cartItems.filter({ hasText: product.name });

            await expect.soft(tile.locator('.iphone')).toBeVisible();
            await expect.soft(tile.locator('.item__title')).toContainText(product.name);
            await expect.soft(tile.locator('.item__quantity')).toContainText('' + product.quantity);
        }
    }

    async applyCoupon(coupon:string) {
        await this.edtCoupon.fill(coupon);
        await this.ctaApplyCoupon.click();
    }

    async verifyCouponApplied(coupon:string) {
        await expect.soft(this.edtCoupon).toHaveValue(coupon);
        await expect.soft(this.couponMessage).toContainText('Coupon Applied');
    }

    async placeOrder() {
        await this.ctaPlaceOrder.click();
    }
    
    async shippingAddress(country: string) {
        await this.edtCountryAutocomplete.pressSequentially(country.slice(0, 3));
        await this.countrySuggestions.getByRole('button').filter({ hasText: new RegExp(`${country}$`)}).click();
    }
    
    async verifyEmail(email: string) {
        await expect(this.edtEmail).toHaveValue(email);
    }
    
    async selectCreditCardPayment() {
        let payment = this.paymentSelector.locator('.payment__type--cc');
        await this.selectPayment(payment);
    }
    
    protected async selectPayment(payment: Locator) {
        await payment.click();
        await expect.soft(payment).toHaveClass(/active/g);
    }

}