import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { AppService } from './app.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http:HttpClient,
    private app:AppService,
    private storage:StorageService) { }

  
// My Orders
public myOrders(user:number) {
  return this.http.get(this.app.endPoint+ '/api/orders/get_by_buyer/'+user, this.app.httpAutherizedHeader).pipe(
    map((response: ApiResponse) => {
      return response;
    }),
    catchError((error) => {
      let errorMessage = error.message !== undefined ? error.message : error.statusText;
      console.log(errorMessage);
      return throwError("Something Went Wrong");
    }))
}

  
// My Orders Details Items
public myOrderItems(orderId:number) {
  return this.http
    .get(
      this.app.endPoint + '/api/order/details/get_by_order/' + orderId,
      this.app.httpAutherizedHeader
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
