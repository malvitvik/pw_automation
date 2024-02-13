import {RegistrationPage} from "../../pages/client/registrationPage";

export interface RegistrationPageFixtures {
    registrationPage: RegistrationPage;
}

export const registrationPageFixtures = {
    registrationPage: async ({page}: any, use: (arg0: RegistrationPage) => any) => {
        const registrationPage = new RegistrationPage(page);
        await use(registrationPage);
    }
};