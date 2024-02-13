import {OrderSummary} from "../../pages/client/orderSummary";

export interface OrderSummaryFixtures {
    orderSummary: OrderSummary;
}

export const orderSummaryFixtures = {
    orderSummary: async ({page}: any, use: (arg0: OrderSummary) => any) => {
        const orderSummary = new OrderSummary(page);
        await use(orderSummary);
    }
};