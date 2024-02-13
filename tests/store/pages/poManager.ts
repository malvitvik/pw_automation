import {Page} from "@playwright/test";
import {LoginPage} from "./client/loginPage";
import {Header} from "./client/header";
import {ProductListingPage} from "./client/productListingPage";
import {ShoppingCart} from "./client/shoppingCart";
import {CheckoutPage} from "./client/checkoutPage";
import {OrderSummary} from "./client/orderSummary";
import {OrderHistory} from "./client/orderHistory";
import {OrderDetails} from "./client/orderDetails";

export class PoManager {
    public readonly loginPage: LoginPage;
    public readonly header: Header;
    public readonly plp: ProductListingPage;
    public readonly cart: ShoppingCart;
    public readonly checkout: CheckoutPage;
    public readonly orderSummary: OrderSummary;
    public readonly orderHistory: OrderHistory;
    public readonly orderDetails: OrderDetails;
    
    constructor(public readonly page: Page) {
        this.loginPage = new LoginPage(page);
        this.header = new Header(page);
        this.plp = new ProductListingPage(page);
        this.cart = new ShoppingCart(page);
        this.checkout = new CheckoutPage(page);
        this.orderSummary = new OrderSummary(page);
        this.orderHistory = new OrderHistory(page);
        this.orderDetails = new OrderDetails(page);
    }
}