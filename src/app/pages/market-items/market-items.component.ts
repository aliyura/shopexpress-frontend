import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppCluster } from 'src/app/app.shared.cluster';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/models/product.model';
import { Category } from 'src/app/models/category.model';
import { SubCategory } from 'src/app/models/sub-category.model';
import { List } from 'src/app/types/list.type';

@Component({
  selector: 'app-market-items',
  templateUrl: './market-items.component.html',
  styleUrls: ['./market-items.component.css'],
})
export class MarketItemsComponent implements OnInit {
  itemsData: any;
  itemsList: any;
  categories: any;
  choosedProduct: any;
  saveItem: any;
  isLoading: boolean = true;
  isMoreLoading: boolean = false;
  scrollCheck: boolean = false;
  curentPage: number = 0;
  percentage: number;
  subCategories: List<SubCategory>
  subCategoryId: string = null;
  categoryId: string = null

  constructor(
    public app: AppCluster,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private storage: StorageService,
    private notification: NotificationService
  ) {

  }

  async allProduct() {
    if (this.curentPage > 0) this.isMoreLoading = true;
    else this.isLoading = true;

    if (this.categoryId == null && this.subCategoryId == null) {
      this.productService.getAllProducts(this.curentPage).subscribe(
        (response: ApiResponse) => {
          this.isMoreLoading = false;
          this.isLoading = false;
          if (response.success) {
            this.itemsData = response.payload;
            if (this.curentPage == 0) this.itemsList = response.payload.content;
            else if (response.payload.content.length > 0)
              Array.prototype.push.apply(
                this.itemsList,
                response.payload.content
              );
          }
        },
        (err) => {
          this.isMoreLoading = false;
          this.isLoading = false;
        }
      );
    }
    else if (this.categoryId != null && this.subCategoryId == null) {
      this.productService.getProductsByCategory(this.curentPage, parseInt(this.categoryId))
        .subscribe(
          (response: ApiResponse) => {
            this.isMoreLoading = false;
            this.isLoading = false;

            if (response.success) {
              this.itemsData = response.payload;
              if (this.curentPage == 0)
                this.itemsList = response.payload.content;
              else if (response.payload.content.length > 0)
                Array.prototype.push.apply(
                  this.itemsList,
                  response.payload.content
                );
            }
          },
          (err) => {
            this.isMoreLoading = false;
            this.isLoading = false;
          }
        );
    }
    else {
      this.productService.getProductsBySubCategory(this.curentPage, parseInt(this.subCategoryId))
        .subscribe(
          (response: ApiResponse) => {
            this.isMoreLoading = false;
            this.isLoading = false;

            if (response.success) {
              this.itemsData = response.payload;
              if (this.curentPage == 0)
                this.itemsList = response.payload.content;
              else if (response.payload.content.length > 0)
                Array.prototype.push.apply(
                  this.itemsList,
                  response.payload.content
                );
            }
          },
          (err) => {
            this.isMoreLoading = false;
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


  buy(cartInput, item: Product) {
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


  public loadCategories() {
    try {
      var categories = this.storage.get(Store.CATEGORY);
      if (categories != null) {
        this.categories = JSON.parse(categories);
        this.categories.forEach(current => {
          var category = current['category'] as Category;
          if (category.id == Number(this.categoryId)) {
            this.subCategories = current['subCategories'] as List<SubCategory>
          }
        });
      }
    } catch (ex) {
      console.log(ex);
      console.log('Unable to convert categories to JSON');
    }
  }

  loadProductByCategory(categoryId: number) {
    this.isLoading = true;
    this.itemsData = null;
    this.itemsList = null;
    this.productService
      .getProductsByCategory(this.curentPage, categoryId)
      .subscribe(
        (response: ApiResponse) => {
          this.isLoading = false;
          if (response.success) {
            this.itemsData = response.payload;
            if (this.curentPage == 0) this.itemsList = response.payload.content;
            else if (response.payload.content.length > 0)
              Array.prototype.push.apply(
                this.itemsList,
                response.payload.content
              );
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
  loadProductBySubCategory(subCategoryId: number) {
    this.isLoading = true;
    this.itemsData = null;
    this.itemsList = null;

    this.productService
      .getProductsBySubCategory(this.curentPage, subCategoryId)
      .subscribe(
        (response: ApiResponse) => {
          this.isLoading = false;
          if (response.success) {
            this.itemsData = response.payload;
            if (this.curentPage == 0) this.itemsList = response.payload.content;
            else if (response.payload.content.length > 0)
              Array.prototype.push.apply(
                this.itemsList,
                response.payload.content
              );
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }

  onScroll() {
    if (!this.isMoreLoading) {
      if (this.itemsData != null) {
        if (this.curentPage < this.itemsData['totalPages'] - 1) {
          this.scrollCheck = true;
          this.curentPage = this.curentPage + 1;
          this.allProduct();
          console.log('scrolled');
        }
      }
    }
  }

  onFilter(e) {
    var subCategoryId = e.target.value;
    this.loadProductBySubCategory(subCategoryId);
  }
  onFilterByCategory(e) {
    var categoryId = e.target.value;
    this.loadProductByCategory(categoryId);
  }
  nextPage(current) {
    if (!this.isMoreLoading) {
      if (this.curentPage < this.itemsData['totalPages'] - 1) {
        this.scrollCheck = true;
        this.curentPage = parseInt(current) + 1;
        this.allProduct();
        console.log('loaded');
      }
    }
  }
  ngOnInit(): void {
    //save current URL
    this.storage.save('returnURL', window.location.href);
    this.percentage = environment.percentage;
    this.subCategoryId = this.route.snapshot.paramMap.get('subCategoryId');
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');

    this.allProduct();
    this.loadCategories();
    this.titleService.setTitle(
      'Shop with ShopExpress, enjoy 20% discount on all products'
    );
  }
}

