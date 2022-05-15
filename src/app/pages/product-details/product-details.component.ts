import { Product } from './../../models/product.model';
import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { Reviews } from 'src/app/models/reviews.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { List } from 'src/app/types/list.type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  form: FormValidator;
  id: number;
  relatedProducts: any;
  relatedProductItems: any;
  product: Product;
  reviewLength: number;
  categories: any;
  reviewRate: any = 0;
  reviewList: any;
  percentage: number;
  cartItems = [];
  saveItem: any;
  userInfo: any;
  isAuthenticated: any;
  currentImage: string = '';
  isLoading: boolean = true;
  isLatestLoading: boolean = true;
  isReviewLoading: boolean = true;
  maxOrderQuantity: number = environment.maxCartItemQuantity;
  quantity = 1;
  colors: any;
  sizes: any;
  selectedColors: any = [];
  selectedSizes: any = []


  constructor(
    public app: AppCluster,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private storage: StorageService,
    private notificationService: NotificationService,
    private auth: AuthenticationService
  ) {
    this.form = new FormValidator(Reviews, 'form');
  }

  setDefault(e) {
    e.target.src = 'assets/images/notFound.jpg';
  }
  onQuantityChange(e) {
    this.quantity = e.target.value;
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

  saveToCart(cartInput, item) {
    this.saveItem = Object.assign(item, {
      color: this.selectedColors.length > 0 ? this.selectedColors.toString() : "Any",
      size: this.selectedSizes.length > 0 ? this.selectedSizes.toString() : "Any",
      quantity: cartInput.quantity,
      yards: cartInput!.yards,
    });
    this.productService.saveCart(this.saveItem);
    this.notificationService.notifySuccess('Added to your Cart');
  }


  // Add to cart function
  addToCart(cartInput, item) {
    if (
      cartInput.quantity != null &&
      cartInput.quantity != '' &&
      Number(cartInput.quantity) > 0) {

      if (item.price > 0) {
        this.saveToCart(cartInput, item);
      }
      else {
        if (cartInput.quantity <= 1) {
          if (this.noFreeItemsInCart()) {
            this.saveToCart(cartInput, item);
          } else {
            this.notificationService.notifyWarning('You already have a free item in your Cart');
          }
        } else {
          this.notificationService.notifyWarning('You can\'t order more than 1 free item in a month, consider reducing quantity');
        }
      }

    } else {
      this.notificationService.notifyWarning('Quantity cannot be empty');
    }
  }

  buy(cartInput, item) {
    if (
      (this.quantity != null || item != null) &&
      this.quantity > 0
    ) {

      if (item.price > 0) {
        this.saveToCart(cartInput, item);
        this.storage.save('returnURL', environment.appHost+"/checkout");
        this.router.navigate(['/checkout']);
      }
      else {
        if (cartInput.quantity <= 1) {
          if (this.noFreeItemsInCart()) {
            this.saveToCart(cartInput, item);
            this.storage.save('returnURL', environment.appHost+"/checkout");
            this.router.navigate(['/checkout']);
          } else {
            this.notificationService.notifyWarning('You already have a free item in your Cart');
          }
        } else {
          this.notificationService.notifyWarning('You can\'t order more than 1 free item in a month, consider reducing You can\'t order more than 1 free item in a month, consider reducing the quantity');
        }
      }

    } else {
      this.notificationService.notifyWarning('Quantity cannot be empty');
    }
  }
  // Remove cart
  clearCart() {
    this.storage.remove('cart');
    this.notificationService.notifySuccess('Cleared');
  }
  // Adding review
  addReview(values) {
    console.log(values);
    if (this.auth.isAuthenticated) {
      var revDetails = {
        userId: this.auth.authenticatedUser.id,
        productId: parseInt(this.route.snapshot.paramMap.get('id')),
        review: values.review,
        rate: this.reviewRate,
      };
      console.log(revDetails);
      // Adding revie
      this.id = parseInt(this.route.snapshot.paramMap.get('id'));
      this.productService.addReview(revDetails).subscribe((response: ApiResponse) => {
        if (response.success) {
          this.product = response.payload;
          this.notificationService.notifySuccess(
            'Review Submited Successfully'
          );
          this.getRiview();
        } else {
          this.notificationService.notifyError(response.message);
        }
      });
    } else {
      this.notificationService.notifyWarning('You are not logged in');
      this.router.navigate(['/login']);
    }
  }

  // Getting review rating
  getReviewRate(count) {
    this.reviewRate = count;
  }

  // Add Recent viewed
  recentViewd() {
    if (this.isAuthenticated) {
      console.log('ok');
      this.productService
        .addRecentViewd(parseInt(this.route.snapshot.paramMap.get('id')))
        .subscribe(
          (response: ApiResponse) => {
            console.log(response);
            if (response.success) {
              console.log('marked as veiwed');
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  async switchView(image) {
    this.currentImage = image;
  }
  // getting product details based on route id
  async productDetails(id: number) {
    this.isLoading = true;
    this.product = null;
    this.productService.getProductsById(id).subscribe((response: ApiResponse) => {
      this.isLoading = false;
      if (response.success) {
        this.product = response.payload;
        this.currentImage = this.product.thumbnail;
        this.titleService.setTitle(
          'Buy ' +
          this.product.name +
          ' as ' +
          ' NGN' +
          this.app.toMoney(this.product.price) +
          ' Only on ShopExpress'
        );
        this.getRelatedProducts(this.product.categoryId)

        if (this.product.color != null)
          this.colors = this.product.color.split(",");
        if (this.product.sizes != null)
          this.sizes = this.product.sizes.split(",");
      }
    });
  }

  // getting product details based on route id
  async getRiview() {
    this.isReviewLoading = true;
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.productService.getRiview(this.id).subscribe(
      (response: ApiResponse) => {
        this.isReviewLoading = false;
        if (response.success) {
          this.reviewList = response.payload;
          this.reviewLength = response.payload.length;
        }
      },
      (err) => {
        this.isReviewLoading = false;
      }
    );
  }
  // New Added

  async getRelatedProducts(catgeoryId) {
    this.isLatestLoading = true;
    this.productService.getProductsByCategory(0, catgeoryId).subscribe((response: ApiResponse) => {
      this.isLatestLoading = false;
      if (response.success) {
        // console.log(response.payload)
        this.relatedProducts = response;
        this.relatedProductItems = response.payload.content;
      }
    });
  }
  //
  public loadCategories() {
    try {
      var categories = this.storage.get(Store.CATEGORY);
      if (categories != null) {
        this.categories = JSON.parse(categories);
      } else {
        this.storage.recheck(() => {
          this.loadCategories();
        }, 100);
      }
    } catch (ex) {
      console.log(ex);
      console.log('Unable to convert categories to JSON');
    }
  }
  ngOnInit(): void {
    //save current URL
    this.storage.save('returnURL', window.location.href);
    this.loadCategories();
    this.percentage = environment.percentage;
    this.route.params.subscribe((queryParams) => {
      if (queryParams.id != null) {
        this.id = queryParams.id;
        this.productDetails(queryParams.id);
      }
    });
    this.userInfo = JSON.parse(this.storage.get(Store.USER));
    this.isAuthenticated = this.auth.isAuthenticated;
    this.recentViewd();
    this.getRiview();
  }
}
