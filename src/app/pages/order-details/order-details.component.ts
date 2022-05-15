import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/api-response.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderService } from 'src/app/services/order.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  itemsList: any;
  authorized: boolean;
  isLoading: boolean = true;

  constructor(
    public app: AppCluster,
    private titleService: Title,
    private order: OrderService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  setDefault(e) {
    e.target.src = 'assets/images/notFound.jpg';
  }

  async orderDetails(orderId: number) {
    this.isLoading = true;
    this.order.myOrderItems(orderId).subscribe(
      (response: ApiResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.itemsList = response.payload;
          console.log(this.itemsList);
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.id != null) {
        this.orderDetails(queryParams.id);
        this.authorized = this.authService.isAuthenticated;
        if (!this.authorized) {
          this.router.navigate(['/login']);
        }
      }
    });
    this.titleService.setTitle('My Order Details');
  }
}
