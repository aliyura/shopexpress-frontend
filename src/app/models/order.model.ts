import { PaymentOption } from './../enum/payment-option.enum';
import { Status } from 'src/app/enum/status.enum';
export class Order {
  id: number;
  buyerId: number;
  sellers: Array<number>;
  transactionId: string;
  orderReferenceId: number;
  paymentReferenceId: string;
  products: Array<number>;
  totalAmount: number;
  tax: number;
  buyerName:string
  buyerMobileNumber:string
  alternativeNumber:string
  locationCode:number;
  address:string
  deliveryFee:number;
  status:Status
  paymentOption:PaymentOption
  lastModifiedDate:Date
  createdDate:Date
}
