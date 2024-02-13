import {ProductListingPage} from "../../pages/client/productListingPage";

export interface ProductListingPageFixtures {
    plp: ProductListingPage;
}

export const productListingPageFixtures = {
    plp: async ({page}: any, use: (arg0: ProductListingPage) => any) => {
        const plp = new ProductListingPage(page);
        await use(plp);
    }
};