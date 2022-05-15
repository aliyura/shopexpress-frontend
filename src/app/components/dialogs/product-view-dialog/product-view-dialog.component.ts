import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AppCluster } from './../../../app.shared.cluster';
import { Product } from './../../../models/product.model';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-product-view-dialog',
  templateUrl: './product-view-dialog.component.html',
  styleUrls: ['./product-view-dialog.component.css'],
})
export class ProductViewDialogComponent implements OnInit {
  @Input() product: Product;
  currentImage: string;
  saveItem: any;
  maxOrderQuantity: number = environment.maxCartItemQuantity;
  quantity = 1;
  colors: any;
  sizes: any;
  selectedColors: any = [];
  selectedSizes: any = []
  isVisible: boolean = false;

  constructor(
    public app: AppCluster,
    private router: Router,
    private storage: StorageService,
    private productService: ProductService,
    private notification: NotificationService
  ) {
    console.log(this.product);
  }

  setDefault(e) {
    e.target.src = 'assets/images/notFound.jpg';
  }

  onQuantityChange(e) {
    this.quantity = e.taregt.value;
  }

  toggleColorsOptionDrawer() {
    var element = <HTMLDivElement>document.getElementById('colorsOptionDrawer');
    if (element.classList.contains('show')) {
      element.classList.remove('show')
    } else {
      element.classList.add('show')
      if (document.getElementById('sizesOptionDrawer'))
        document.getElementById('sizesOptionDrawer').classList.remove('show');
    }

  }
  toggleSizesOptionDrawer() {
    var element = <HTMLDivElement>document.getElementById('sizesOptionDrawer');
    if (element.classList.contains('show')) {
      element.classList.remove('show')
    } else {
      element.classList.add('show')

      if (document.getElementById('colorsOptionDrawer'))
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
    this.notification.notifySuccess('Added to your Cart');
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
            this.notification.notifyWarning('You already have a free item in your Cart');
          }
        } else {
          this.notification.notifyWarning('You can\'t order more than 1 free item in a month, consider reducing quantity');
        }
      }

    } else {
      this.notification.notifyWarning('Quantity cannot be empty');
    }
  }

  buy(cartInput, item) {
    if (
      (this.quantity != null || item != null) &&
      this.quantity > 0
    ) {

      if (item.price > 0) {
        this.saveToCart(cartInput, item);
        this.storage.save('returnURL', environment.appHost + "/checkout");
        this.router.navigate(['/checkout']);

        if (document.querySelector('.modal-backdrop')) {
          document.querySelectorAll('.modal-backdrop').forEach((element) => {
            element.classList.add('hidden')
            element.classList.remove('show')
          });

        }
      }
      else {
        if (cartInput.quantity <= 1) {
          if (this.noFreeItemsInCart()) {
            this.saveToCart(cartInput, item);
            this.storage.save('returnURL', environment.appHost + "/checkout");
            this.router.navigate(['/checkout']);

            if (document.querySelector('.modal-backdrop')) {
              document.querySelectorAll('.modal-backdrop').forEach((element) => {
                element.classList.add('hidden')
                element.classList.remove('show')
              });

            }
          } else {
            this.notification.notifyWarning('You already have a free item in your Cart');
          }
        } else {
          this.notification.notifyWarning('You can\'t order more than 1 free item in a month, consider reducing You can\'t order more than 1 free item in a month, consider reducing the quantity');
        }
      }
    } else {
      this.notification.notifyWarning('Quantity cannot be empty');
    }
  }


  async switchView(image) {
    this.product.thumbnail = image;
  }

  ngAfterContentChecked(): void {
    if (this.product == null) {
      this.isVisible = false;
    }
    else {
      this.isVisible = true
    }
    if (this.isVisible && (!this.colors && !this.sizes)) {
      if (this.product != null) {
        if (this.product.color != null)
          this.colors = this.product.color.split(",");
        if (this.product.sizes != null)
          this.sizes = this.product.sizes.split(",");
      }
    }
  }

  ngOnInit(): void {

  }
}
