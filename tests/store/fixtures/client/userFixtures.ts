import {CreditCard} from "../../models/creditCard";
import creditCardData from '../../../../test-data/creditCard.json';
import userData from '../../../../test-data/users/user.json';
import {randomInt} from "../../../../utils/helper";
import {User} from "../../models/user";

export interface UserFixtures {
    user: User;
    creditCard : CreditCard;
}

export const userFixtures = {
    user:  async ({} : any, use: (arg0: User) => any) => {
        const no: string = ('00' + randomInt(1_000)).slice(-3);
        let user: User = userData;

        for (let key of Object.keys(user)) {
            user[key] = user[key].replace("${no}", no);
        }

        await use(user);
    },

    creditCard: async ({} : any, use: (arg0: CreditCard) => any) => {
        let creditCard = new CreditCard(creditCardData);
        await use(creditCard);
    }
};