import {CheckoutPage} from "../pages/checkout/checkoutPage";

export interface CheckoutFixtures {
    checkoutPage: CheckoutPage;
}

export const checkoutFixtures = {
    checkout: async ({page}: any, use: (arg0: CheckoutPage) => any) => {
        const checkout = new CheckoutPage(page);
        await use(checkout);
    }
};