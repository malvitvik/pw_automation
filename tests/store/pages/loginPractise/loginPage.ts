import {expect, Locator, Page} from "@playwright/test";

export class LoginPage {
    
    protected readonly page: Page;
    protected readonly errorMessage : Locator;
    protected readonly usernameField : Locator;
    protected readonly passwordField : Locator;
    protected readonly userTypeRadio : Locator;
    protected readonly confirmButton : Locator;
    protected readonly userRoleCombobox : Locator;
    protected readonly termsAndConditionsCheckbox : Locator;
    protected readonly signInButton : Locator;
    protected readonly userCredentials : Locator;

    constructor(page: Page) {
        this.page = page;
        this.errorMessage = page.locator('.alert');
        this.usernameField = page.locator('#username');
        this.passwordField = page.locator('#password');
        this.userTypeRadio = page.locator('.customradio');
        this.confirmButton = page.locator('.modal-dialog .btn-success');
        this.userRoleCombobox = page.locator('select');
        this.termsAndConditionsCheckbox = page.locator('#terms');
        this.signInButton = page.locator('#signInBtn');
        this.userCredentials = page.locator('p.text-center i');
    }
    
    async login(user?:{username?:string, password?:string, 
                userType?:string, userRole?:string, terms?:boolean}) {
        user = await this.getUser(user);
        
        await this.usernameField.fill(user.username);
        await this.passwordField.fill(user.password);
        
        if (user.userType !== undefined) {
            let radioButton = this.userTypeRadio.filter({has: this.page.locator(`[value=${user.userType}]`)});
            await radioButton.click();
            
            if (user.userType === 'user')
                await this.confirmButton.click();
            
            await expect(radioButton).toBeChecked();
        }
            
        if (user.userRole !== undefined) 
            await this.userRoleCombobox.selectOption(user.userRole);
        
        await this.termsAndConditionsCheckbox.setChecked(user.terms);
        await this.signInButton.click();
    }
    
    async verifyErrorMessage(message:string) {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toHaveCSS("display", "block");
        await expect(this.errorMessage).toHaveText(message);
        await expect(this.errorMessage).toBeHidden();
        await expect(this.errorMessage).toHaveCSS("display", "none");
    }
    
    protected async getUser(user?:{username?:string, password?:string,
        userType?:string, userRole?:string, terms?:boolean}) {
        if (user === undefined)
            user = {};

        if (user.username === undefined)
            user.username = await this.userCredentials.first().textContent();

        if (user.password === undefined)
            user.password = await this.userCredentials.last().textContent();

        if (user.terms === undefined)
            user.terms = true;
        
        return user;
    }
}