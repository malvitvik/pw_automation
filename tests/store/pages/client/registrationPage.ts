import {expect, Locator, Page} from "@playwright/test";

export class RegistrationPage {
    protected readonly page: Page;
    protected readonly edtFirstName : Locator;
    protected readonly edtLastName : Locator;
    protected readonly edtEmail : Locator;
    protected readonly edtPhoneNumber : Locator;
    protected readonly cbxOccupation : Locator;
    protected readonly rgpGender : Locator;
    protected readonly edtPassword : Locator;
    protected readonly edtConfirmPassword : Locator;
    protected readonly cbxConfirmAge : Locator;
    protected readonly ctaSignUp : Locator;
    protected readonly title : Locator;
    protected readonly ctaLogin : Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.edtFirstName = page.locator('#firstName');
        this.edtLastName = page.locator('#lastName');
        this.edtEmail = page.locator('#userEmail');
        this.edtPhoneNumber = page.locator('#userMobile');
        this.cbxOccupation = page.locator('select[formcontrolname="occupation"]');
        this.rgpGender = page.locator('[formcontrolname="gender"]');
        this.edtPassword = page.locator('#userPassword');
        this.edtConfirmPassword = page.locator('#confirmPassword');
        this.cbxConfirmAge = page.getByRole('checkbox');
        this.ctaSignUp = page.locator('#login');
        this.title = page.locator('.login-wrapper h1');
        this.ctaLogin = page.locator('.login-wrapper button');
    }
    
    async registerUser(user: {firstName:string, lastName:string, email:string, phoneNumber:string,
        occupation?:string, gender?:string, password:string, confirmPassword?:string, confirmAge?:boolean}) {

        if (user.confirmAge === undefined)
            user.confirmAge = true;
        
        if (user.confirmPassword === undefined)
            user.confirmPassword = user.password;
        
        if (user.lastName !== undefined)
            await this.edtLastName.fill(user.firstName);

        if (user.occupation !== undefined)
            await this.cbxOccupation.selectOption(user.occupation);
        
        if (user.gender !== undefined) {
            for (let radiobutton of await this.rgpGender.all()) {
                if (user.gender === await radiobutton.getAttribute('value')) {
                    await radiobutton.click();
                }
            }
        }
        
        await this.edtFirstName.fill(user.firstName);
        await this.edtEmail.fill(user.email);
        await this.edtPhoneNumber.fill(user.phoneNumber);
        await this.edtPassword.fill(user.password);
        await this.edtConfirmPassword.fill(user.confirmPassword);
        await this.cbxConfirmAge.setChecked(user.confirmAge);
        
        await this.ctaSignUp.click();
    }
    
    async verifyRegistered() {
        await expect(this.title).toHaveText('Account Created Successfully')
    }
    
    async openLoginPage() {
        await this.ctaLogin.click();
    }
}