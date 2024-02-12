import {Header} from "../pages/header/header";

export interface HeaderFixtures {
    header: Header;
}

export const headerFixtures = {
    header: async ({page}: any, use: (arg0: Header) => any) => {
        const header = new Header(page);
        await use(header);
    }
};