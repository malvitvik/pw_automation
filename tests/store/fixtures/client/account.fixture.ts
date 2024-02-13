import {RegistrationPage} from "../../pages/client/registrationPage";
import {LoginPage} from "../../pages/client/loginPage";

export interface AccountFixtures {
    loginPage: LoginPage;
    registrationPage: RegistrationPage;
}

export const accountFixtures = {
    loginPage: async ({page}: any, use: (arg0: LoginPage) => any) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    
    registrationPage: async ({page}: any, use: (arg0: RegistrationPage) => any) => {
        const registrationPage = new RegistrationPage(page);
        await use(registrationPage);
    }
};