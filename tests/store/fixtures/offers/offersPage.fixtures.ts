import {OffersPage} from "../../pages/offers/offersPage";

export interface OffersPageFixtures {
    offersPage: OffersPage;
}

export const offersPageFixtures = {
    offersPage: async ({page}: any, use: (arg0: OffersPage) => any) => {
        const header = new OffersPage(page);
        await use(header);
    }
};