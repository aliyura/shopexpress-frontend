import { Order } from './../models/order.model';
import { ProgressDialogService } from './progress-dialog.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(
    private app: AppService,
    private progressDialog: ProgressDialogService,
    private http: HttpClient
  ) {}

  public verifyVoucher(serial: string, pin: string) {
    this.progressDialog.show();
    return this.http
      .post(
        this.app.endPoint + '/api/card/verify?serial=' + serial + '&pin=' + pin,
        '',
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

  public checkOut(checkout: any) {
    this.progressDialog.show();
    return this.http
      .post(
        this.app.endPoint + '/api/order/add',
        checkout,
        this.app.httpHeader
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

  public confirmPayment(order: Order) {
    this.progressDialog.show();
    return this.http.post(
        this.app.endPoint + '/api/order/confirm-payment',order,this.app.httpAutherizedHeader
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
}
