import {ShoppingCart} from "../../pages/client/shoppingCart";

export interface ShoppingCartPageFixtures {
    cart: ShoppingCart;
}

export const shoppingCartPageFixtures = {
    cart: async ({page}: any, use: (arg0: ShoppingCart) => any) => {
        const cart = new ShoppingCart(page);
        await use(cart);
    }
};