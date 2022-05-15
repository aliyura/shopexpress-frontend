import { Product } from './../../../models/product.model';
import { Router } from '@angular/router';
import { Shop } from './../../../models/shop.model';
import { ShopService } from './../../../services/shop.service';
import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { AppService } from 'src/app/services/app.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { List } from 'src/app/types/list.type';
import { Category } from 'src/app/models/category.model';
import { CategoryType } from 'src/app/enum/category-type.enum';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategory } from 'src/app/models/sub-category.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  newArrivals: any;
  newArrivalsItems: any;
  topProducts: any;
  choosedProduct: any;
  deals: any;
  shops: List<Shop>;
  saveItem: any;
  percentage: number;
  isTopProductsLoading: boolean = true;
  isNewArrivalsLoading: boolean = true;
  isDealOfTheWeekLoading: boolean = true;
  quantity: Number = 1;
  colors: any;
  sizes: any;
  selectedColors: any = [];
  selectedSizes: any = []
  isCategoryLoading: boolean = true;
  categories: any
  chosenCategories: any

  constructor(
    public app: AppCluster,
    private productService: ProductService,
    private storage: StorageService,
    private categoryService: CategoryService,
    private router: Router,
    private notification: NotificationService
  ) { }

  setDefault(e) {
    e.target.src = 'assets/images/notFound.jpg';
  }



  toggleColorsOptionDrawer() {
    var element = <HTMLDivElement>document.getElementById('colorsOptionDrawer');
    if (element.classList.contains('show')) {
      element.classList.remove('show')
    } else {
      element.classList.add('show')
      document.getElementById('sizesOptionDrawer').classList.remove('show');
    }

  }
  toggleSizesOptionDrawer() {
    var element = <HTMLDivElement>document.getElementById('sizesOptionDrawer');
    if (element.classList.contains('show')) {
      element.classList.remove('show')
    } else {
      element.classList.add('show')
      document.getElementById('colorsOptionDrawer').classList.remove('show');
    }
  }

  selectColor(e) {
    var element = <HTMLDivElement>e.target;
    var color = element.textContent;
    if (this.selectedColors.includes(color)) {
      element.querySelector("#optionCheck").setAttribute('hidden', 'true')
      element.classList.remove('active')
      this.selectedColors.splice(this.selectedColors.indexOf(color), 1);
    } else {
      element.querySelector("#optionCheck").removeAttribute('hidden')
      element.classList.add('active')
      document.getElementById('colorsOptionDrawer').classList.remove('show');
      this.selectedColors.push(color);
    }
  }

  selectSize(e) {
    var element = <HTMLDivElement>e.target;
    var color = element.textContent;
    if (this.selectedSizes.includes(color)) {
      element.querySelector("#optionCheck").setAttribute('hidden', 'true')
      element.classList.remove('active')
      this.selectedSizes.splice(this.selectedSizes.indexOf(color), 1);
    } else {
      element.querySelector("#optionCheck").removeAttribute('hidden')
      element.classList.add('active')
      document.getElementById('sizesOptionDrawer').classList.remove('show');
      this.selectedSizes.push(color);
    }
  }


  getCartItems() {
    var cartData = this.storage.get('cart');
    if (cartData != null) {
      var cartItems = JSON.parse(cartData);
      return cartItems
    }
  }

  noFreeItemsInCart() {
    var cartItems = this.getCartItems();
    var thereIsFreeItem = true;
    if (cartItems != null) {
      cartItems.forEach(item => {
        if (item.price <= 0) {
          thereIsFreeItem = false;
        }
      });
    }
    return thereIsFreeItem;
  }

  saveToCart(item) {
    this.saveItem = Object.assign(item, {
      color: this.selectedColors.length > 0 ? this.selectedColors.toString() : "Any",
      size: this.selectedSizes.length > 0 ? this.selectedSizes.toString() : "Any",
      quantity: this.quantity,
    });
    this.productService.saveCart(this.saveItem);
    this.notification.notifySuccess('Added to your Cart');
  }

  addToCart(item) {
    if (this.quantity > 0) {

      if (item.price > 0) {
        this.saveToCart(item);
      } else {
        if (this.noFreeItemsInCart()) {
          this.saveToCart(item)
        } else {
          this.notification.notifyWarning('You already have a free item in your Cart');
        }
      }
    } else {
      this.notification.notifyWarning('Quantity cannot be empty');
    }
  }



  buy(item) {
    if (this.quantity > 0) {
      if (item.price > 0) {
        this.saveToCart(item);
        this.storage.save('returnURL', environment.appHost+"/checkout");
        this.router.navigate(['/checkout']);

      } else {
        if (this.noFreeItemsInCart()) {
          this.saveToCart(item)
          this.storage.save('returnURL', environment.appHost+"/checkout");
          this.router.navigate(['/checkout']);
        } else {
          this.notification.notifyWarning('You already have a free item in your Cart');
        }
      }
    } else {
      this.notification.notifyWarning('Quantity cannot be empty');
    }
  }

  async getTopProducts() {
    this.isTopProductsLoading = true;
    this.productService.getProductsByCategory(0, 3).subscribe(
      (response: ApiResponse) => {
        this.isTopProductsLoading = false;
        if (response.success) {
          this.topProducts = response.payload.content;
        }
      },
      (err) => {
        console.log(err);
        this.isTopProductsLoading = false;
      }
    );
  }

  async getNewArrivals() {
    this.isNewArrivalsLoading = true;
    this.productService.getAllProducts(0).subscribe(
      (response: ApiResponse) => {
        this.isNewArrivalsLoading = false;
        if (response.success) {
          this.newArrivals = response;
          this.newArrivalsItems = response.payload.content;
        }
      },
      (err) => {
        this.isNewArrivalsLoading = false;
      }
    );
  }
  async dealOfTheWeek() {
    this.isDealOfTheWeekLoading = true;
    this.productService.dealOfTheWeek(0).subscribe(
      (response: ApiResponse) => {
        this.isDealOfTheWeekLoading = false;
        if (response.success) {
          this.deals = response.payload.content;
        }
      },
      (err) => {
        this.isDealOfTheWeekLoading = false;
      }
    );
  }

  selected(ch) {
    this.choosedProduct = ch;
    console.log('selected');
    console.log(this.choosedProduct);
  }

  async getCategories() {
    this.categoryService.getCategoriesByType(CategoryType.PRODUCT).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          if (response.payload != null) {
            this.storage.save(Store.CATEGORY, JSON.stringify(response.payload));
            this.categories = response.payload;
            this.chosenCategories = this.categories[2]['subCategories']
            this.chosenCategories.push(...this.categories[3]['subCategories']);
          }
        }
        this.isCategoryLoading = false;

      },
      (err) => {
        console.log(err);
      }
    );
  }

  public loadCategories() {
    try {
      this.isCategoryLoading = true;
      var categories = this.storage.get(Store.CATEGORY);
      if (categories != null) {
        this.categories = JSON.parse(categories);
        this.chosenCategories = this.categories[2]['subCategories']
        this.chosenCategories.push(...this.categories[3]['subCategories']);
        this.isCategoryLoading = false;
      } else {
        this.getCategories();
      }

    } catch (ex) {
      console.log(ex);
      console.log('Unable to convert categories to JSON');
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.getTopProducts();
    this.getNewArrivals();
    this.dealOfTheWeek();
    this.percentage = environment.percentage;
  }
}
