import {test as base} from '@playwright/test';
import {LoginPageFixtures, loginPageFixtures} from "./fixtures/loginPractise/loginPage.fixtures";
import {StorePageFixtures, storePageFixtures} from "./fixtures/loginPractise/storePage.fixtures";

const test = base.extend<LoginPageFixtures & StorePageFixtures>({
    ...loginPageFixtures,
    ...storePageFixtures
});

test.describe('Login tests', async () => {

    test.beforeEach(async ({page}) => {
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
        test.only(`Positive login for [${JSON.stringify(user)}]`, async ({ loginPage, storePage }) => {
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
        test(`Negative login with [${JSON.stringify({username:user.username, password:user.password})}] credentials`, 
            async ({ loginPage }) => {
            await loginPage.login(user);
            await loginPage.verifyErrorMessage(user.errorMessage);
        });
    }

});