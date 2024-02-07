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
    
    async login(user:{username:string, password:string}) {
        await this.edtUsername.fill(user.username);
        await this.edtPassword.fill(user.password);
        await this.ctaSignIn.click();
    }
    
    async openForgotPassword() {
        await this.ctaForgotPassword.click();
    }
}