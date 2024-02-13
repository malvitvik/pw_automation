import {OrderHistory} from "../../pages/client/orderHistory";

export interface OrderHistoryFixtures {
    orderHistory: OrderHistory;
}

export const orderHistoryFixtures = {
    orderHistory: async ({page}: any, use: (arg0: OrderHistory) => any) => {
        const orderHistory = new OrderHistory(page);
        await use(orderHistory);
    }
};