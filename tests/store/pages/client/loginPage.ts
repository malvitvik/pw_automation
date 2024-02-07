import {LoginWidget} from "./widgets/loginWidget";
import {Locator, Page} from "@playwright/test";

export class LoginPage {
    protected readonly page: Page;
    protected readonly loginWidget : LoginWidget;
    protected readonly ctaRegister: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.loginWidget = new LoginWidget(page);
        this.ctaRegister = page.locator("a[href$='/register']");
    }
    
    async login(user:{username:string, password:string}) {
        await this.loginWidget.login(user);
    }
    
    async openForgotPassword() {
        await this.loginWidget.openForgotPassword();
    }
    
    async openRegistration() {
        await this.ctaRegister.click();
    }
} 