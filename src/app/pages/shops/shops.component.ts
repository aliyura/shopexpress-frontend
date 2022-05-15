import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { AppCluster } from 'src/app/app.shared.cluster';
import { ApiResponse } from 'src/app/models/api-response.model';
import { Shop } from 'src/app/models/shop.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { ShopService } from 'src/app/services/shop.service';
import { List } from 'src/app/types/list.type';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css'],
})
export class ShopsComponent implements OnInit {
  shops: List<Shop>;
  isShopsLoading: boolean = true;
  isMoreLoading: boolean = false;
  scrollCheck: boolean = false;
  curentPage: number = 0;
  totalPages: number = 0;

  constructor(public app: AppCluster, private shopService: ShopService) {}

  onScroll() {
    if (!this.isMoreLoading) {
      if (this.shops != null) {
        if (this.curentPage < this.totalPages - 1) {
          this.scrollCheck = true;
          this.curentPage = this.curentPage + 1;
          this.getShops();
          console.log('scrolled');
        }
      }
    }
  }
  nextPage(current) {
    if (!this.isMoreLoading) {
      if (this.curentPage < this.totalPages - 1) {
        this.scrollCheck = true;
        this.curentPage = parseInt(current) + 1;
        this.getShops();
        console.log('loaded');
      }
    }
  }

  async getShops() {
     if (this.curentPage > 0) this.isMoreLoading = true;
     else this.isShopsLoading = true;
    
    this.shopService.getShops(this.curentPage).subscribe(
      (response: ApiResponse) => {
        this.isShopsLoading = false;
        this.isMoreLoading = false;
        if (response.success) {
             this.totalPages = response.payload['totalPages'];
             if (this.curentPage == 0) {
               this.shops = response.payload['content'];
             } else {
               if (response.payload['content'].length > 0) {
                 Array.prototype.push.apply(
                   this.shops,
                   response.payload['content']
                 );
               }
             }
        }
        console.log(this.shops);
      },
      (err) => {
        this.isShopsLoading = false;
        this.isMoreLoading = false;
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.getShops();
  }
}
