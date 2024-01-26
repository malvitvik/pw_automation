import {expect, Locator, Page} from "@playwright/test";

export class CheckoutPage {
    protected readonly page: Page;
    protected readonly countryDropDown: Locator;
    protected readonly termsAndConditionsCheckbox: Locator;
    protected readonly placeOrderButton: Locator;
    protected readonly orderConfirmationMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.countryDropDown = page.getByRole('combobox');
        this.termsAndConditionsCheckbox = page.getByRole('checkbox');
        this.placeOrderButton = page.getByRole('button');
        this.orderConfirmationMessage = page.getByText('Thank you');
    }
    
    async placeOrder(country: string, termsAndConditions:boolean=true) {
        await this.countryDropDown.selectOption(country);
        await this.termsAndConditionsCheckbox.setChecked(termsAndConditions);
        await this.placeOrderButton.click();
    }
    
    async verifyPlacedOrder() {
        await expect(this.orderConfirmationMessage).toBeVisible();
        await expect.soft(this.orderConfirmationMessage).toContainText('success');

        let url = this.page.url();
        await expect(this.orderConfirmationMessage).toBeHidden();
        await expect.soft(this.page).not.toHaveURL(url); //page is redirected
    }
}