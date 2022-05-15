import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from 'src/app/enum/store.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { ApiResponse } from 'src/app/models/api-response.model';
import { CategoryType } from 'src/app/enum/category-type.enum';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css'],
})
export class TopComponent implements OnInit {
  categories: any;
  authenticated: boolean;
  cartItems = [];
  cartTotalPrice: number = 0;
  cartTotal: number = 0;
  searchQuery: string = '';
  isLoading: boolean = true;
  isOpen: boolean = false;

  constructor(
    public app: AppCluster,
    private storage: StorageService,
    private notification: NotificationService,
    private auth: AuthenticationService,
    private categoryService:CategoryService,
    private router: Router,
    private route:ActivatedRoute
  ) {}

  setDefault(e) {
    e.target.src = 'assets/images/notFound.jpg';
  }

  search(obj) {
    var val = obj.value;
    if (val != '') {
      if (obj.getAttribute('tag')) {
        var tag = obj.getAttribute('tag');
        this.router.navigate(['/shop/', tag], { queryParams: { q: val } });
      } else {
        this.router.navigate(['/search'], { queryParams: { q: val } });
      }
    } else {
      this.notification.notifyWarning('Field Cannot be empty');
    }
  }

  public gotoCategories() {
    var param = this.app.getURLParameter(location.href);
    if (param !=null && param !='' && param.length>0) {
      this.router.navigate(['/categories'])
    }
  }
  // Logout
  public logOut() {
    var returnURL=window.location.href;
    console.log(returnURL)
    this.storage.remove(Store.TOKEN);
    this.storage.save('returnURL',returnURL);
    this.router.navigate(['/login']);
  }
  //login
  public login(){
    var returnURL=window.location.href;
    this.storage.save('returnURL',returnURL);
    this.router.navigate(['/login']);
  }
  public getShortName(fullName) {
    return fullName.split(' ')[0];
  }


  async getCategories() {
    this.categoryService.getCategoriesByType(CategoryType.PRODUCT).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          if (response.payload != null)
            //store in session storage
            this.storage.save(Store.CATEGORY, JSON.stringify(response.payload));
        }
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public loadCategories() {
    try {
      this.isLoading = true;
      var categories = this.storage.get(Store.CATEGORY);
      if (categories != null) {
        this.categories = JSON.parse(categories);
        this.isLoading = false;
      }else{
        this.getCategories();
      }
    } catch (ex) {
      console.log(ex);
      console.log('Unable to convert categories to JSON');
    }
  }

  public loadSearchQuery() {
    try {
      var query = this.storage.get(Store.SEARCH);
      if (query != null) {
        this.searchQuery = query;
      }
    } catch (ex) {
      console.log('Unable to convert categories to JSON');
    }
  }
  get authenticatedUser() {
    return this.auth.authenticatedUser;
  }

  //
  getCartPrice() {
    this.cartTotalPrice = 0;
    this.isLoading = true;
    var cartData = this.storage.get('cart');
    if (cartData != null) {
      this.cartItems = JSON.parse(cartData);
      this.cartTotal = this.cartItems.length;
      for (let i = 0; i < this.cartItems.length; i++) {
        this.cartTotalPrice +=
          this.cartItems[i].price * this.cartItems[i].quantity;
      }
    }
  }
  // Remove cart
  clearCart() {
    this.storage.remove('cart');
    this.notification.notifySuccess('Cleared');
    this.getCartPrice();
  }

  removeItem(item) {
    this.cartItems.splice(parseInt(item), 1);
    this.storage.remove('cart');
    this.storage.save('cart', JSON.stringify(this.cartItems));
    this.cartTotalPrice = 0;
    this.getCartPrice();
  }

  toggleDrawer() {
    if (this.isOpen) {
      this.isOpen = false;
      this.app.enableScrolling();
    } else {
      this.isOpen = true;
      this.app.disableScrolling();
    }
  }



  ngOnInit(): void {
    this.loadSearchQuery();
    this.loadCategories();
    this.authenticated = this.auth.isAuthenticated;
    this.getCartPrice();
    this.cartTotal = this.cartItems.length;
    this.app.monitor(() => {
      this.getCartPrice();
    }, 1000);
  }
}
