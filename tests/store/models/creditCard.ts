export class CreditCard {
    owner: string;
    cardNumber: string;
    expiryDate: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    
    constructor({ owner, cardNumber, expiryDate, cvv }) {
        this.owner = owner;
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.expiryDate = expiryDate;
        
        let expiry = expiryDate.split('/');
        this.expiryMonth = expiry[0];
        this.expiryYear = expiry[1];
    }
}