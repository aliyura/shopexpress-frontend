import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/enum/store.enum';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css'],
})
export class CartsComponent implements OnInit {
  cartItems = [];
  cartTotalPrice: number = 0;
  isYardBased: boolean = false;
  isLoading: boolean = true;

  constructor(
    public app: AppCluster,
    private titleService:Title,
    private storage: StorageService,
    private notification: NotificationService
  ) {}

  setDefault(e) {
    e.target.src = 'assets/images/notFound.jpg';
  }
  //
  getCartPrice() {
    var cartData = this.storage.get('cart');
    if (cartData != null) {
      this.cartItems = JSON.parse(cartData);
      for (let i = 0; i < this.cartItems.length; i++) {
        var item = this.cartItems[i];
        if (item.size == 'yard') {
          this.isYardBased = true;
          this.cartTotalPrice += ((item.price * item.yards) * item.quantity);
        } else {
           this.cartTotalPrice += item.price * item.quantity;
        }
      }
    }
    this.isLoading = false;
  }
  // Remove cart
  clearCart() {
    this.storage.remove('cart');
    this.notification.notifySuccess('Cleared');
  }

  removeItem(item) {
    this.cartItems.splice(parseInt(item), 1);
    this.storage.remove('cart');
    this.storage.save('cart', JSON.stringify(this.cartItems));
    this.cartTotalPrice = 0;
    this.getCartPrice();
  }
  ngOnInit(): void {
    this.storage.save('returnURL', environment.appHost+"/checkout");
    this.cartItems = JSON.parse(this.storage.get('cart'));
    this.getCartPrice();
    console.warn(JSON.stringify(this.storage.get(Store.USER)));
    this.titleService.setTitle('My Cart');
  }
}
