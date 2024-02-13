import {LoginPage} from "../../pages/loginPractise/loginPage";

export interface AccountFixtures {
    loginPage: LoginPage;
}

export const accountFixtures = {
    loginPage: async ({page}: any, use: (arg0: LoginPage) => any) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    }
};