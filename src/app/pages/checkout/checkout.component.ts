import { Checkout } from './../../models/checkout';
import { AppCluster } from './../../app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentOption } from 'src/app/enum/payment-option.enum';
import { Order } from 'src/app/models/order.model';
import { Title } from '@angular/platform-browser';
import { LocationService } from 'src/app/services/location.service';
import { Login } from 'src/app/models/login';
import { LoginToken } from 'src/app/models/login-token';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { FormValidator } from 'src/app/validators/form-custom.validator';
import { UserRequest } from 'src/app/models/user-request.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  selectedPay: PaymentOption = PaymentOption.COD;
  cartItems = [];
  cartTotalPrice: number = 0;
  currentUser: User;
  isYardBased: boolean = false;
  locations: any;
  deliveryFee: any = 0;
  none: string = "";
  form: FormValidator;

  constructor(
    public app: AppCluster,
    private storage: StorageService,
    private titleService: Title,
    private paymentService: PaymentService,
    private authService: AuthenticationService,
    private notification: NotificationService,
    private checkoutService: CheckoutService,
    private locationService: LocationService,
    private router: Router,
    private store: StorageService,
    private route: Router
  ) {
    this.form = new FormValidator(Checkout, 'form');
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  checkout() {

    this.form.revalidate();
    var order = this.form.data as Checkout;
    order.products = this.cartItems;
    order.paymentOption = this.selectedPay;
    order.tax = 0;

    if (order.customerName == '' || order.customerName.length < 3) {
      this.notification.notifyWarning("Customer Full Name Required!")
    }
    else if (order.locationCode.toString().length < 1) {
      this.notification.notifyWarning("State/City Name Required!")
    }
    else if (order.address == '') {
      this.notification.notifyWarning("Enter your Address!")
    }
    else if (order.phoneNumber == '') {
      this.notification.notifyWarning("Enter your Phone Number!")
    }
    else if (!this.app.validMobile(order.phoneNumber)) {
      this.notification.notifyWarning("Mobile Number not correct!")
    }
    else {
      if (this.selectedPay == 'COD') {
        this.initiateOrder(order);
      } else if (this.selectedPay == 'BANK') {
        this.initiateOrder(order);
      } else {
        this.notification.notifyWarning('Please Select Payment Method');
      }
    }
  }

  selected(e, val) {
    this.selectedPay = val;
    document.querySelectorAll('.single-payment-gateway').forEach((element) => {
      element.classList.remove('active');
    });
    e.target.parentElement.classList.add('active');
  }
  // Getting price based on location selected
  getFee(e) {
    var locationCode = e.target.value;
    this.deliveryFee = 0;

    this.locations.forEach((loc) => {
      if (loc.code == locationCode) {
        this.cartItems.forEach((item) => {
          if (this.deliveryFee < 1000) {
            this.deliveryFee += ((loc.deliveryFee));
          }
          else {
            this.deliveryFee += ((loc.deliveryFee / 3))
          }

        })
      }
    });
  }
  // Checkout, add order
  async initiateOrder(check: Checkout) {
    if (check.paymentOption == PaymentOption.COD && this.getCartPrice() > 20000) {
      this.notification.notifyError('Sorry, Cash on delivery order is not allowed for the amount that is greater than 20,000 naira');
    } else {
      this.checkoutService.checkOut(check).subscribe((response: ApiResponse) => {
        if (response.success) {
          var initiatedOrder = response.payload as Order;
          if (initiatedOrder.paymentOption == PaymentOption.BANK) {
            this.paymentService.pay(initiatedOrder);
          }
          else {
            this.notification.notifySuccess('Order successful');
            this.storage.remove('cart');

            if (!this.isAuthenticated) {
              var user = new User();
              user.name=check.customerName
              user.email = check.emailAddress;
              user.mobile = check.phoneNumber;
              user.address = check.address;
              this.storage.save(Store.USER, JSON.stringify(user));
              this.storage.save('returnURL', environment.appHost+"/orders");
            }

            setTimeout(() => {
              Date;
              this.router.navigate(['/order/status']);
            }, 500);
          }
        } else {
          this.notification.notifyWarning(response.message);
        }
      });
    }
  }

  getCartPrice() {
    this.cartTotalPrice = 0;
    var cartData = this.storage.get('cart');
    if (cartData != null) {
      this.cartItems = JSON.parse(cartData);
      for (let i = 0; i < this.cartItems.length; i++) {
        var item = this.cartItems[i];
        if (item.size == 'yard') {
          this.isYardBased = true;
          this.cartTotalPrice += item.price * item.yards * item.quantity;
        } else {
          this.cartTotalPrice += item.price * item.quantity;
        }
      }
      return this.cartTotalPrice;
    }
  }

  async getLocations() {
    this.locationService.getLocations().subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          console.log(response);
          if (response.payload != null)
            //store in session storegae
            this.storage.saveSession(
              Store.LOCATIONS,
              JSON.stringify(response.payload)
            );
          this.locations = response.payload;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public loadLocations() {
    try {
      var locations = this.storage.get(Store.LOCATIONS);
      if (locations != null) {
        this.locations = JSON.parse(locations);
      } else {
        this.getLocations();
      }
    } catch (ex) {
      this.getLocations();
      console.log(ex);
      console.log('Unable to convert locations to JSON');
    }
  }

  ngOnInit(): void {
    //save current URL
    this.storage.save('returnURL', window.location.href);
    this.cartItems = JSON.parse(this.storage.get('cart'));
    this.currentUser = JSON.parse(this.storage.get(Store.USER)) as User;
    this.loadLocations();
    this.getCartPrice();
    this.titleService.setTitle(
      'Complete your order by checking out now on ShopExpress'
    );
    if(this.cartItems.length<=0){
      this.router.navigate(['/cart'])
  }
  }
}
