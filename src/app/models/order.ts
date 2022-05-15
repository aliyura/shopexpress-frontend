import { PaymentOption } from '../enum/payment-option.enum';
import { List } from '../types/list.type';

export class Order {
  id: number;
  buyerId: number;
  sellers: List<number>;
  transactionId: string;
  orderReferenceId: string;
  paymentReferenceId: string;
  products: List<number>;
  totalAmount: number;
  tax: number;
  buyerName: string;
  buyerMobileNumber: string;
  alternativeNumber: string;
  locationCode: string;
  note:string;
  address: string;
  deliveryFee: number;
  status: string;
  paymentOption: PaymentOption;
  lastModified: Date;
  created: Date;
}
