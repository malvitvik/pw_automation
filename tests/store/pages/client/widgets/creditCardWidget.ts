import {CreditCard} from "../../../models/creditCard";
import {Locator, Page} from "@playwright/test";

export class CreditCardWidget {
    protected readonly page: Page;
    protected readonly edtCardOwner: Locator;
    protected readonly edtCardNumber: Locator;
    protected readonly cbxExpiryMonth: Locator;
    protected readonly cbxExpiryYear: Locator;
    protected readonly edtCvv: Locator;
    
    constructor(page: Page) {
        this.page = page;
        let textBoxes = page.locator('input[type="text"]');
        let combobox = page.getByRole('combobox');
        this.edtCardOwner = textBoxes.nth(2);
        this.edtCardNumber = textBoxes.first();
        this.cbxExpiryMonth = combobox.first();
        this.cbxExpiryYear = combobox.last();
        this.edtCvv = textBoxes.nth(1);
    }
    
    async fill(creditCard: CreditCard) {
        await this.edtCardOwner.fill(creditCard.owner);
        await this.edtCardNumber.fill(creditCard.cardNumber);
        await this.cbxExpiryMonth.selectOption(creditCard.expiryMonth);
        await this.cbxExpiryYear.selectOption(creditCard.expiryYear.slice(2));
        await this.edtCvv.fill(creditCard.cvv);
    }
}