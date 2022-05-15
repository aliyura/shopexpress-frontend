import { ShopService } from './../../services/shop.service';
import { Shop } from './../../models/shop.model';
import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response.model';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { Store } from 'src/app/enum/store.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';
import { Title } from '@angular/platform-browser';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-shop-items',
  templateUrl: './shop-items.component.html',
  styleUrls: ['./shop-items.component.css'],
})
export class ShopItemsComponent implements OnInit {
  products: any;
  categories: any;
  choosedProduct: any;
  saveItem: any;
  isLoading: boolean = true;
  isMoreLoading: boolean = false;
  scrollCheck: boolean = false;
  curentPage: number = 0;
  percentage: number;
  searchQuestion: string;
  totalPages: number = 0;
  currentPage: number = 0;
  currentShop: Shop;
  currentShopName: string;

  constructor(
    public app: AppCluster,
    private titleService: Title,
    private productService: ProductService,
    private router:Router,
    private shopService: ShopService,
    private storage: StorageService,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  async allProduct() {
    if (this.curentPage > 0) this.isMoreLoading = true;
    else this.isLoading = true;

    if (this.currentShopName != null && this.searchQuestion != null) {
      this.productService
        .searchProductsByShopName(
          this.currentShopName,
          this.searchQuestion,
          this.curentPage
        )
        .subscribe(
          (response: ApiResponse) => {
            this.isMoreLoading = false;
            this.isLoading = false;
            if (response.success) {
              this.totalPages = response.payload['totalPages'];
              if (this.curentPage == 0) {
                this.products = response.payload['content'];
              } else {
                if (response.payload['content'].length > 0) {
                  Array.prototype.push.apply(
                    this.products,
                    response.payload['content']
                  );
                }
              }
            }
          },
          (err) => {
            this.isMoreLoading = false;
            this.isLoading = false;
          }
        );
    } else {
      this.productService
        .getProductsByShopName(this.currentShopName, this.curentPage)
        .subscribe(
          (response: ApiResponse) => {
            this.isMoreLoading = false;
            this.isLoading = false;
            if (response.success) {
              this.totalPages = response.payload['totalPages'];
              if (this.curentPage == 0) {
                this.products = response.payload['content'];
              } else {
                if (response.payload['content'].length > 0) {
                  Array.prototype.push.apply(
                    this.products,
                    response.payload['content']
                  );
                }
              }
            }
          },
          (err) => {
            this.isMoreLoading = false;
            this.isLoading = false;
          }
        );
    }
  }

  async searchProduct() {
    this.isLoading = true;
    this.products = null;
    if (this.currentShopName != null && this.searchQuestion != null) {
      this.productService.searchProductsByShopName(
          this.currentShopName,
          this.searchQuestion,
          this.curentPage
        )
        .subscribe(
          (response: ApiResponse) => {
            this.isLoading = false;
            if (response.success) {
              this.totalPages = response.payload['totalPages'];
              this.products = response.payload['content'];
            }
          },
          (err) => {
            console.log(err);
            this.isLoading = false;
          }
        );
    }
  }

  selected(ch) {
    this.choosedProduct = ch;
  }

  // Add to cart
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


  //
  public loadCategories() {
    try {
      var categories = this.storage.get(Store.CATEGORY);
      if (categories != null) {
        this.categories = JSON.parse(categories);
      }
    } catch (ex) {
      console.log(ex);
      console.log('Unable to convert categories to JSON');
    }
  }

  onScroll() {
    if (!this.isMoreLoading) {
      if (this.products != null) {
        if (this.curentPage < this.totalPages - 1) {
          this.scrollCheck = true;
          this.curentPage = this.curentPage + 1;
          this.allProduct();
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
        this.allProduct();
        console.log('loaded');
      }
    }
  }
  ngOnInit(): void {
    var shopName = this.app.getURLParameter(location.href);
    if (shopName != null) {
      //get current shop
      this.currentShopName = shopName;
      document.querySelectorAll('.searchInput').forEach((element) => {
        if (element != null) element.setAttribute('tag', this.currentShopName);
      });
      this.shopService.getShopByTag(this.currentShopName).subscribe(
        (response: ApiResponse) => {
          if (response.success) {
            this.currentShop = response.payload;
            this.titleService.setTitle(
              'Shop with ' +
                this.currentShop.name +
                ', enjoy 20% discount on all products today'
            );
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

    this.titleService.setTitle(
      'Shop with ShopExpress, enjoy 20% discount on all products today'
    );

    this.percentage = environment.percentage;
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.q != null) {
        this.searchQuestion = queryParams.q;
        this.searchProduct();

      }
        console.log(this.searchQuestion);
    });

    this.allProduct();
    this.loadCategories();
  }
}
