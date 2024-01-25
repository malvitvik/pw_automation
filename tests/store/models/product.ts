export class Product {
    readonly name:string;
    readonly quantity:number;
    
    constructor(name:string, quantity:number=1) {
        this.name = name;
        this.quantity = quantity;
    }
}