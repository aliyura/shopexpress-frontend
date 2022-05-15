import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { SearchService } from 'src/app/services/search.service';
import { StorageService } from 'src/app/services/storage.service';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/models/product.model';
import { List } from 'src/app/types/list.type';
import { SubCategory } from 'src/app/models/sub-category.model';
import { Category } from 'src/app/models/category.model';
import { FormValidator } from 'src/app/validators/form-custom.validator';
import { SearchSubscription } from 'src/app/models/search-subscription.model';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  itemsData: any;
  itemsList: any;
  categories: any;
  choosedProduct: any;
  id: number;
  saveItem: any;
  cartQuan: any = '0';
  percentage: number = 0;
  searchQuestion: string = '';
  isLoading: boolean = true;
  isMoreLoading: boolean = false;
  curentPage: number = 0;
  searchVal: any;
  scrollCheck: boolean = false;
  subCategories: List<SubCategory>
  savedSubscription:SearchSubscription;
  form: FormValidator;


  constructor(
    public app: AppCluster,
    private route: ActivatedRoute,
    private titleService: Title,
    private router: Router,
    private search: SearchService,
    private storage: StorageService,
    private subscriptionService: SubscriptionService,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {
    this.form = new FormValidator(SearchSubscription, 'searchForm');
  }

  async searchProduct(searchquery) {
    if (this.curentPage > 0) {
      this.isMoreLoading = true;
    } else {
      this.itemsData = null;
      this.itemsList = null;
      this.isLoading = true;
    }

    this.searchQuestion = searchquery;
    this.storage.save(Store.SEARCH, searchquery);

    this.search.searchProducts(searchquery, this.curentPage).subscribe(
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

  loadProductByCategory(categoryId: number) {
    this.isLoading = true;
    this.itemsData = null;
    this.itemsList = null;
    this.productService.getProductsByCategory(this.curentPage, categoryId).subscribe(
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

    this.productService.getProductsBySubCategory(this.curentPage, subCategoryId).subscribe(
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
      this.notificationService.notifySuccess('Added to your Cart');
    } else {
      this.notificationService.notifyWarning('Quantity cannot be empty');
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
      this.notificationService.notifyWarning('Quantity cannot be empty');
    }
  }


  onScroll() {
    if (!this.isMoreLoading) {
      if (this.curentPage < this.itemsData['totalPages'] - 1) {
        this.scrollCheck = true;

        this.curentPage = this.curentPage + 1;
        this.searchProduct(this.searchQuestion);
        console.log('scrolled!!');
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
      if (this.itemsData != null) {
        if (this.curentPage < this.itemsData['totalPages'] - 1) {
          this.scrollCheck = true;
          this.curentPage = current + 1;
          this.searchProduct(this.searchQuestion);
          console.log('loaded!!');
        }
      }
    }
  }
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

  addSubscription() {
    this.form.revalidate();
    let response = this.form.response;
    var subscription = this.form.data as SearchSubscription;
    if (response['name'].ok && response['contact'].ok) {
      subscription.item = this.searchQuestion;
      this.subscriptionService.addSearchSubscription(subscription).subscribe(
        (response: ApiResponse) => {
          if (response.success) {
              this.savedSubscription=response.payload as SearchSubscription
          }else{
            this.notificationService.notifyError("Unable to save your Search notification request!")
          }
        })
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.percentage = environment.percentage
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.q != null) {
        this.searchQuestion = queryParams.q;
        this.searchProduct(queryParams.q);
      }
    });
    this.titleService.setTitle(
      'Shop with ShopExpress, enjoy 20% discount on all products'
    );
  }
}
