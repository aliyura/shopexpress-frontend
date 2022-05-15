import { PaymentOption } from "../enum/payment-option.enum";

export class Checkout {
    customerName: string;
    products: Array<string>;
    locationCode: number;
    address: string;
    paymentOption: PaymentOption;
    phoneNumber:string;
    emailAddress:string;
    note:string;
    tax: number;
}
