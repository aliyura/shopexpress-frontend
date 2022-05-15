import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/api-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { ProgressDialogService } from './progress-dialog.service';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(
    private progressDialog: ProgressDialogService,
    private app: AppService,
    private http: HttpClient
  ) {}

  public getShopById(id: number) {
    return this.http
      .get(
        this.app.endPoint + '/api/shop/get_by_id/' + id,
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

  public getShopByVendorId(vendorId: number) {
    return this.http
      .get(
        this.app.endPoint + '/api/shop/get_by_vendor_id/' + vendorId,
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

  public getShopBySuid(suid: string) {
    return this.http
      .get(
        this.app.endPoint + '/api/shop/get_by_suid/' + suid,
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

  public getShopByTag(tag: string) {
    return this.http
      .get(
        this.app.endPoint + '/api/shop/get_by_tag/' + tag,
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

  public getShopByCategory(catgeory: string, page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/shop/get_by_category/' +
          catgeory +
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

  public getShopByCity(city: string, page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/shop/get_by_city/' +
          city +
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

  public getAllShopsBySearch(q: string, page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/shop/get_by_search/' +
          q +
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

  public getShops(page: number) {
    return this.http
      .get(
        this.app.endPoint +
          '/api/shop/get_shops' +
          '?page=' +
          page +
          '&size=' +
        5,
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
