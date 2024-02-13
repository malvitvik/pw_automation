import {CheckoutPage} from "../../pages/client/checkoutPage";
import {ShoppingCart} from "../../pages/client/shoppingCart";
import {OrderSummary} from "../../pages/client/orderSummary";

export interface CheckoutFixtures {
    cart: ShoppingCart;
    checkout: CheckoutPage;
    orderSummary: OrderSummary;
}

export const checkoutFixtures = {
    cart: async ({page}: any, use: (arg0: ShoppingCart) => any) => {
        const cart = new ShoppingCart(page);
        await use(cart);
    },
    
    checkout: async ({page}: any, use: (arg0: CheckoutPage) => any) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },
    
    orderSummary: async ({page}: any, use: (arg0: OrderSummary) => any) => {
        const orderSummary = new OrderSummary(page);
        await use(orderSummary);
    }
};