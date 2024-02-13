import {ProductGrid} from "../pages/productGrid";

export interface ProductGridFixtures {
    productGrid: ProductGrid;
}

export const productGridFixtures = {
    productGrid: async ({page}: any, use: (arg0: ProductGrid) => any) => {
        const productGrid = new ProductGrid(page);
        await use(productGrid);
    }
};