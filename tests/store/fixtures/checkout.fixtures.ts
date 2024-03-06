import {CheckoutPage} from "../pages/checkout/checkoutPage";
import {ShoppingCart} from "../pages/checkout/shoppingCart";

export interface CheckoutFixtures {
    cart: ShoppingCart;
    checkoutPage: CheckoutPage;
}

export const checkoutFixtures = {
    cart: async ({page}: any, use: (arg0: ShoppingCart) => any) => {
        const cart = new ShoppingCart(page);
        await use(cart);
    },
    
    checkoutPage: async ({page}: any, use: (arg0: CheckoutPage) => any) => {
        const checkout = new CheckoutPage(page);
        await use(checkout);
    }
};