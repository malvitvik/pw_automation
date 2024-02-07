import {test} from '@playwright/test';
import {LoginPage} from "./pages/loginPractise/loginPage";
import {StorePage} from "./pages/loginPractise/storePage";

test.describe('Login tests', async () => {

    let loginPage: LoginPage;
    let storePage: StorePage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        storePage = new StorePage(page);

        await page.goto('/loginpagePractise/');
    });

    const validUsers = [
        {userRole: 'stud',    userType:'admin', terms: true},
        {userRole: 'stud',    userType:'user',  terms: true},
        {userRole: 'stud',    userType:'admin', terms: false},
        {userRole: 'stud',    userType:'user',  terms: false},
        {userRole: 'teach',   userType:'admin', terms: true},
        {userRole: 'teach',   userType:'user',  terms: true},
        {userRole: 'teach',   userType:'admin', terms: false},
        {userRole: 'teach',   userType:'user',  terms: false},
        {userRole: 'consult', userType:'admin', terms: true},
        {userRole: 'consult', userType:'user',  terms: true},
        {userRole: 'consult', userType:'admin', terms: false},
        {userRole: 'consult', userType:'user',  terms: false}
    ];

    for (let user of validUsers) {
        test.only(`Positive login for [${JSON.stringify(user)}]`, async () => {
            await loginPage.login(user);
            await storePage.verifyOpened();
        });
    }
    
    const invalidUsers = [
        {username:'',        password:'',        errorMessage:'Empty username/password.'},
        {username:'',        password:'invalid', errorMessage:'Empty username/password.'},
        {username:'invalid', password:'',        errorMessage:'Empty username/password.'},
        {username:'invalid', password:'invalid', errorMessage:'Incorrect username/password.'}
    ];

    for (let user  of invalidUsers) {
        test(`Negative login with [${JSON.stringify({username:user.username, password:user.password})}] credentials`, async () => {
            await loginPage.login(user);
            await loginPage.verifyErrorMessage(user.errorMessage);
        });
    }

});