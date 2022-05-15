import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { ProgressDialogService } from './progress-dialog.service';
import { DialogHandlerService } from './dialog-handler.service';
import { ApiResponse } from './../models/api-response.model';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Order } from './../models/order.model';
import { AppCluster } from './../app.shared.cluster';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Flutterwave, PaymentSuccessResponse } from 'flutterwave-angular-v3';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  order: Order;

  constructor(
    private app: AppCluster,
    private storage: StorageService,
    private route: Router,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
    private checkoutService: CheckoutService,
    private progressDialog: ProgressDialogService,
    private flutterwave: Flutterwave
  ) {}

  pay(order: Order) {
    if (order != null) {
      this.order = order;
      this.flutterwave.inlinePay({
        public_key: environment.flutterWavePublicKey,
        tx_ref: this.app.getUniqueId(20),
        amount: order.totalAmount,
        currency: 'NGN',
        country: 'NG',
        payment_options: 'account,card,ussd,banktransfer,barter',
        redirect_url: '',
        meta: {
          counsumer_id: this.authService.authenticatedUser.uuid,
          consumer_mac: order.transactionId,
        },
        customer: {
          name: this.authService.authenticatedUser.name,
          email: this.authService.authenticatedUser.email,
          phone_number: this.authService.authenticatedUser.mobile,
        },
        callback: this.paymentCallback,
        onclose: this.closedPaymentModal,
        customizations: {
          title: 'ShopExpress',
          description: 'Payment for Items in your Cart',
          logo:'https://shopExpress.s3.amazonaws.com/pictures/shopExpress%203.jpg',
        },
      });
    } else {
      this.notificationService.notifyError('Order not Found');
    }
  }
  paymentCallback(response: PaymentSuccessResponse): void {
    this.order.paymentReferenceId = response.tx_ref;
    this.order.transactionId = response.transaction_id.toString();
    this.progressDialog.show();
    this.checkoutService.confirmPayment(this.order).subscribe(
      (response: ApiResponse) => {
        this.progressDialog.hide();
        if (response.success) {
          this.notificationService.notifySuccess('Payment Successfully');
          this.notificationService.notifySuccess('Order Successfully');
          this.storage.remove('cart');
          setTimeout(() => {
            Date;
            this.route.navigate(['/orders']);
          }, 1000);
        } else {
          this.notificationService.notifyError(response.message);
        }
      },
      (err) => {
        this.progressDialog.hide();
        this.notificationService.notifyError(err);
      }
    );
  }
  closedPaymentModal(): void {
    console.log('Canceled');
    this.notificationService.notifyError('Payment canceled');
  }
}
