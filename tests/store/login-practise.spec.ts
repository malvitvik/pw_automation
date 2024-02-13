import {test as base} from '@playwright/test';
import {accountFixtures, AccountFixtures} from "./fixtures/loginPractise/accountFixtures";
import {ProductFixtures, productFixtures} from "./fixtures/loginPractise/productFixtures";
import validUsers from "../../test-data/users/validUsers.json";
import invalidUsers from "../../test-data/users/invalidUsers.json";

const test = base.extend<AccountFixtures & ProductFixtures>({
    ...accountFixtures,
    ...productFixtures
});

test.describe('Login tests', async () => {

    test.beforeEach(async ({loginPage}) => {
        await loginPage.goTo();
    });

    for (let user of validUsers) {
        test.only(`Positive login for [${JSON.stringify(user)}]`, async ({ loginPage, storePage }) => {
            await loginPage.login(user);
            await storePage.verifyOpened();
        });
    }

    for (let user  of invalidUsers) {
        test(`Negative login with [${JSON.stringify({username:user.username, password:user.password})}] credentials`, 
            async ({ loginPage }) => {
            await loginPage.login(user);
            await loginPage.verifyErrorMessage(user.errorMessage);
        });
    }

});