import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppCluster } from 'src/app/app.shared.cluster';
import { ApiResponse } from 'src/app/models/api-response.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  userInfo: any;
  orders: any;
  isLoading: boolean = true;

  constructor(
    public app: AppCluster,
    private titleService: Title,
    private authService: AuthenticationService,
    private order: OrderService,
    private storage: StorageService
  ) {
  }

  async getMyOrders(user: number) {
    this.isLoading = true;
    this.order.myOrders(user).subscribe(
      (response: ApiResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.orders = response.payload;
          console.log(this.orders);
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    //save current URL
    this.storage.save('returnURL', window.location.href);
    this.userInfo = this.authService.authenticatedUser;
    this.getMyOrders(this.userInfo.id);
    this.titleService.setTitle('My Order History');
  }
}
