import { AppCluster } from './../../app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  form: FormValidator;
  user: User;
  userInfo: any;
  orders: any;
  isLoading: boolean = true;

  constructor(
    public app: AppCluster,
    private titleService:Title,
    private authService: AuthenticationService,
    private order: OrderService
  ) {
    this.form = new FormValidator(User, 'form');
  }

  async myOrder(user: number) {
    this.isLoading = true;
    this.order.myOrders(user).subscribe((response: ApiResponse) => {
      this.isLoading = false;
      if (response.success) {
        this.orders = response.payload;
      }
    },
      (err) => {
       this.isLoading = false;
    
    });
  }

  ngOnInit(): void {
    this.userInfo = this.authService.authenticatedUser;
    this.myOrder(this.userInfo.id);
      this.titleService.setTitle('My Account');
  }
}
