import {OrderDetails} from "../../pages/client/orderDetails";
import {OrderHistory} from "../../pages/client/orderHistory";

export interface OrderFixtures {
    orderHistory: OrderHistory;
    orderDetails: OrderDetails;
}

export const orderFixtures = {
    orderHistory: async ({page}: any, use: (arg0: OrderHistory) => any) => {
        const orderHistory = new OrderHistory(page);
        await use(orderHistory);
    },
    
    orderDetails: async ({page}: any, use: (arg0: OrderDetails) => any) => {
        const orderDetails = new OrderDetails(page);
        await use(orderDetails);
    }
};