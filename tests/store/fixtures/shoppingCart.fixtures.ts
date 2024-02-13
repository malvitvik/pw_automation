import {ShoppingCart} from "../pages/checkout/shoppingCart";

export interface ShoppingCartFixtures {
    shoppingCart: ShoppingCart;
}

export const shoppingCartFixtures = {
    shoppingCart: async ({page}: any, use: (arg0: ShoppingCart) => any) => {
        const shoppingCart = new ShoppingCart(page);
        await use(shoppingCart);
    }
};