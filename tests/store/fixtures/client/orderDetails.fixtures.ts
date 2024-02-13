import {OrderDetails} from "../../pages/client/orderDetails";

export interface OrderDetailsFixtures {
    orderDetails: OrderDetails;
}

export const orderDetailsFixtures = {
    orderDetails: async ({page}: any, use: (arg0: OrderDetails) => any) => {
        const orderDetails = new OrderDetails(page);
        await use(orderDetails);
    }
};