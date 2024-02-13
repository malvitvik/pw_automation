import {expect, Locator, Page} from "@playwright/test";

export class CheckoutPage {
    protected readonly countryDropDown: Locator;
    protected readonly termsAndConditionsCheckbox: Locator;
    protected readonly errorMessage: Locator;
    protected readonly placeOrderButton: Locator;
    protected readonly orderConfirmationMessage: Locator;
    
    constructor(protected page: Page) {
        this.countryDropDown = page.getByRole('combobox');
        this.termsAndConditionsCheckbox = page.getByRole('checkbox');
        this.errorMessage = page.locator('.errorAlert');
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
        await expect(this.orderConfirmationMessage).toBeHidden({timeout: 10_000});
        await expect.soft(this.page).not.toHaveURL(url); //page is redirected
    }
    
    async verifyOrderError() {
        await expect.soft(this.errorMessage).toHaveText('Please accept Terms & Conditions - Required');
        await expect.soft(this.errorMessage).toHaveCSS('color', 'rgb(255, 0, 0)');
    }
}