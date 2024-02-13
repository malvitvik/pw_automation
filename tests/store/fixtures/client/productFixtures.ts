import {ProductListingPage} from "../../pages/client/productListingPage";

export interface ProductFixtures {
    plp: ProductListingPage;
}

export const productFixtures = {
    plp: async ({page}: any, use: (arg0: ProductListingPage) => any) => {
        const plp = new ProductListingPage(page);
        await use(plp);
    }
};