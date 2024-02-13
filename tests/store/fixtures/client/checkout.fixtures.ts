import {CheckoutPage} from "../../pages/client/checkoutPage";

export interface CheckoutFixtures {
    checkout: CheckoutPage;
}

export const checkoutFixtures = {
    checkout: async ({page}: any, use: (arg0: CheckoutPage) => any) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    }
};