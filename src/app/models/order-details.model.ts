import { Status } from 'src/app/enum/status.enum';
export class OrderDetails {
    id: number;
    orderId: number;
    sellerId: number;
    productId: number;
    productName: string;
    quantity: number;
    productLocation: string;
    color: string
    size: string
    status: Status
    price: number;
    amount: number;
    lastModifiedDate: Date
    createdDate: Date
}
