import {expect, test} from '@playwright/test';
import {LoginPage} from "./pages/client/loginPage";
import {RegistrationPage} from "./pages/client/registrationPage";
import {ProductListingPage} from "./pages/client/productListingPage";

test.describe('Client tests', async () => {
    
    let registrationPage: RegistrationPage;
    let loginPage: LoginPage;
    let plp: ProductListingPage;
    
    test.beforeEach(async ({page}) => {
        registrationPage = new RegistrationPage(page);
        loginPage = new LoginPage(page);
        plp = new ProductListingPage(page);
        
        await page.goto('/client/');
    });

    test('Register and login new user', async({page }) => {
        const no =  Math.floor(Math.random() * 1_000);
        let user = {firstName: `firstName${no}`, lastName: `lastName${no}`,
            email: `user_${no}@email.com`, phoneNumber:'3333333333', password:'Qwerty123'};
        
        
        await loginPage.openRegistration();
        await registrationPage.registerUser(user);
        await registrationPage.verifyRegistered();
        await registrationPage.openLoginPage();

        await loginPage.login({username: user.email, password:user.password});
        await plp.verifyOpened();
    });
});