import {APIRequestContext, expect} from "@playwright/test";

export class ApiUtils {
    
    readonly apiContext: APIRequestContext;
    
    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }
    
    async getToken(loginPayload: {}) {
        const loginResponse = await this.apiContext.post('/api/ecom/auth/login', { data: loginPayload });

        expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        return loginResponseJson.token;
    }
    
    async placeOrder(orderPayload: {}, token:string) {
        if (token === undefined)
            throw new Error('Token is undefined.');
        
        const orderResponse = await this.apiContext.post('/api/ecom/order/create-order', {
            data:orderPayload,
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });
        expect(orderResponse.ok()).toBeTruthy();
        const orderResponseJson = await orderResponse.json();
        expect(orderResponseJson.message).toBe('Order Placed Successfully');
        return orderResponseJson.orders[0];
    }
}