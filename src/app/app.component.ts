import { Router } from '@angular/router';
import { LocationService } from './services/location.service';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AppCluster } from './app.shared.cluster';
import { AccountType } from './enum/account-type.enum';
import { CategoryType } from './enum/category-type.enum';
import { Store } from './enum/store.enum';
import { ApiResponse } from './models/api-response.model';
import { User } from './models/user.model';
import { AuthenticationService } from './services/authentication.service';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { StorageService } from './services/storage.service';
import { AppService } from './services/app.service';
import { LoginToken } from './models/login-token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title =
    'Welcome to herb.ng Online Shopping for Organic, Fashion, Electronic and Many More products  - ShopExpress';
  isPinging: boolean = true;
  isUp: boolean = false;

  constructor(
    private app: AppCluster,
    private router: Router,
    private appService: AppService,
    private storage: StorageService,
    private categoryService: CategoryService,
    private authService: AuthenticationService,
    private locationService: LocationService
  ) {}

  async ping() {
    this.appService.ping().subscribe(
      (response: ApiResponse) => {
        this.isPinging = false;
        if (response.success) this.isUp = true;
      },
      (err) => {
        this.isUp = false;
        this.isPinging = false;
        console.log(err);
      }
    );
  }

  async getProductCategories() {
    this.categoryService.getCategoriesByType(CategoryType.PRODUCT).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          if (response.payload != null)
            //store in session storage
            this.storage.save(Store.CATEGORY, JSON.stringify(response.payload));
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async getLocations() {
    this.locationService.getLocations().subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          console.log(response);
          if (response.payload != null)
            //store in session storegae
            this.storage.saveSession(
              Store.LOCATIONS,
              JSON.stringify(response.payload)
            );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }
  get authenticatedUser() {
    return this.authService.authenticatedUser as LoginToken;
  }

  ngOnInit(): void {
    this.app.enableScrolling();
    //ping system
    this.ping();
    //get product categories
    var categories = this.storage.get(Store.CATEGORY);
    if (categories == null) this.getProductCategories();

    //get all locations
    var locations = this.storage.getSession(Store.LOCATIONS);
    if (locations == null) this.getLocations();

   this.router.events.subscribe((event) => {
     this.app.enableScrolling();
   });
  }
}
