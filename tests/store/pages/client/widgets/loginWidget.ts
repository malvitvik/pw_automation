import {Locator, Page} from "@playwright/test";

export class LoginWidget {
    
    protected readonly page: Page;
    protected readonly edtUsername : Locator;
    protected readonly edtPassword : Locator;
    protected readonly ctaForgotPassword : Locator;
    protected readonly ctaSignIn : Locator;

    constructor(page: Page) {
        this.page = page;
        this.edtUsername = page.locator('#userEmail');
        this.edtPassword = page.locator('#userPassword');
        this.ctaForgotPassword = page.locator('.forgot-password-link');
        this.ctaSignIn = page.locator('#login');
    }
    
    async login(user:{userEmail:string, userPassword:string}) {
        await this.edtUsername.fill(user.userEmail);
        await this.edtPassword.fill(user.userPassword);
        await this.ctaSignIn.click();
    }
    
    async openForgotPassword() {
        await this.ctaForgotPassword.click();
    }
}