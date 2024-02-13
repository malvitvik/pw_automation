import {LoginPage} from "../../pages/loginPractise/loginPage";

export interface LoginPageFixtures {
    loginPage: LoginPage;
}

export const loginPageFixtures = {
    loginPage: async ({page}: any, use: (arg0: LoginPage) => any) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    }
};