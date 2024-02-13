import {ProductGrid} from "../pages/productGrid";

export interface ProductFixtures {
    productGrid: ProductGrid;
}

export const productFixtures = {
    productGrid: async ({page}: any, use: (arg0: ProductGrid) => any) => {
        const productGrid = new ProductGrid(page);
        await use(productGrid);
    }
};