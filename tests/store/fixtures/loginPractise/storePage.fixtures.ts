import {StorePage} from "../../pages/loginPractise/storePage";
import {LoginPage} from "../../pages/loginPractise/loginPage";

export interface StorePageFixtures {
    storePage: StorePage;
}

export const storePageFixtures = {
    storePage: async ({page}: any, use: (arg0: StorePage) => any) => {
        const storePage = new StorePage(page);
        await use(storePage);
    }
};