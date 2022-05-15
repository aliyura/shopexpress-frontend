import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppCluster } from 'src/app/app.shared.cluster';
import { ApiResponse } from 'src/app/models/api-response.model';
import { Product } from 'src/app/models/product.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { List } from 'src/app/types/list.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fabric-center',
  templateUrl: './fabric-center.component.html',
  styleUrls: ['./fabric-center.component.css'],
})
export class FabricCenterComponent implements OnInit {
  items: List<Product>;
  isLoading: boolean = true;
  percentage = 20;
  saveItem: any;

  constructor(
    public app: AppCluster,
    private router:Router,
    private productService: ProductService,
    private notification: NotificationService,
    private products: ProductService
  ) {}

  setDefault(e) {
    e.target.src = 'assets/images/notFound.jpg';
  }
  async getTopDeals() {
    this.isLoading = true;
    this.products.getProductsByCategory(0, 1).subscribe(
      (response: ApiResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.items = response.payload.content;
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  addToCart(cartInput, items) {
    if (
      (cartInput.quantity != null || cartInput != null) &&
      cartInput.quantity != ''
    ) {
      if (cartInput.quantity != null) {
        this.saveItem = Object.assign(items, { quantity: cartInput.quantity });
      } else {
        this.saveItem = Object.assign(items, { quantity: cartInput });
      }
      this.productService.saveCart(this.saveItem);
      this.notification.notifySuccess('Added to your Cart');
    } else {
      this.notification.notifyWarning('Quantity cannot be empty');
    }
  }


  buy(cartInput, item:Product) {
    if (
      (cartInput.quantity != null || cartInput != null) &&
      cartInput.quantity != ''
    ) {
      if (cartInput.quantity != null) {
        this.saveItem = Object.assign(item, { quantity: cartInput.quantity });
      } else {
        this.saveItem = Object.assign(item, { quantity: cartInput });
      }
      this.productService.clearCart();
      this.productService.saveCart(this.saveItem);
      this.router.navigate(['/checkout']);
    } else {
      this.notification.notifyWarning('Quantity cannot be empty');
    }
  }

  ngOnInit(): void {
    this.percentage = environment.percentage;
    this.getTopDeals();
  }
}
