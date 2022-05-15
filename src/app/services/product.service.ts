import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProgressDialogService } from './progress-dialog.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AppService } from './app.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartItems = [];
  constructor(
    private http: HttpClient,
    private app: AppService,
    private storage: StorageService,
    private auth: AuthenticationService,
    private progressDialog: ProgressDialogService
  ) {}

  // Saving to cart
  public saveCart(saveItem) {
    if (this.storage.get('cart') == null) {
      this.cartItems = [saveItem];
      this.storage.save('cart', JSON.stringify(this.cartItems));
    } else {
      this.cartItems = JSON.parse(this.storage.get('cart'));
      this.cartItems.push(saveItem);
      this.storage.remove('cart');
      this.storage.save('cart', JSON.stringify(this.cartItems));
    }
  }

  public clearCart(){
    this.storage.remove('cart');
  }
  // getting all product
  public getAllProducts(page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/product/get_all_active?page=' +
          page +
          '&size=' +
          environment.pageSize,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }

  // getting all by shop name
  public getProductsByShopName(shopName: string, page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/product/get_from_shop/' +
          shopName +
          '?page=' +
          page +
          '&size=' +
          environment.pageSize,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }

  // getting all by shop name
  public searchProductsByShopName(shopName: string, q: string, page: number) {
    console.log(shopName);
    console.log(q);

    return this.http
      .get(
        this.app.endPoint +
          '/api/product/search_from_shop/' +
          shopName +
          '?q=' +
          q +
          '&page=' +
          page +
          '&size=' +
          environment.pageSize,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }
  // By Categoryid
  public getProductsByCategory(page: number, categoryid: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/product/get_by_category_id/' +
          categoryid +
          '?page=' +
          page +
          '&size=' +
          environment.pageSize,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }
  // By Sub Categoryid
  public getProductsBySubCategory(page: number, subCategoryId: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/product/get_by_sub_category_id/' +
          subCategoryId +
          '?page=' +
          page +
          '&size=' +
          environment.pageSize,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }

  // By id
  public getProductsById(productId: number) {
    return this.http
      .get(
        this.app.endPoint + '/api/product/get_by_id/' + productId,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }
  // New Arrivals
  public newArrivals(page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/product/get_new_arrivals?page=' +
          page +
          '&size=' +
          environment.pageSize,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }
  // Top Product
  public topProduct(page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/product/get_top_rated?size=' +
          environment.pageSize +
          '&page=' +
          page,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }
  // New Arrivals
  public dealOfTheWeek(page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/product/get_deal_of_week?page=' +
          page +
          '&size=' +
          environment.pageSize,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }
  // New Arrivals
  public getRecentylyViewed(page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/product/viewed_by_user/' +
          this.auth.authenticatedUser.id +
          '?page=' +
          page +
          '&size=' +
          environment.pageSize,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }

  // Add review
  public addReview(val) {
    this.progressDialog.show('Please Wait..');
    return this.http
      .post(
        this.app.endPoint + '/api/review/add',
        val,
        this.app.httpAutherizedHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          this.progressDialog.hide();
          return response;
        }),
        catchError((error) => {
          this.progressDialog.hide();
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }
  // Add Recently Viewed
  public addRecentViewd(prodId) {
    console.log('I am viewed');
    return this.http
      .post(
        this.app.endPoint +
          '/api/product/view/mark/' +
          this.auth.authenticatedUser.id +
          '?product=' +
          prodId,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }
  // Get review
  public getRiview(id: number) {
    return this.http
      .get(
        this.app.endPoint + '/api/review/get_by_product_id/' + id,
        this.app.httpHeader
      )
      .pipe(
        map((response: ApiResponse) => {
          return response;
        }),
        catchError((error) => {
          let errorMessage =
            error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage);
          return throwError('Something Went Wrong');
        })
      );
  }
}
