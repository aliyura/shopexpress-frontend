import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/api-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { ProgressDialogService } from './progress-dialog.service';
import { throwError } from 'rxjs';
import { SearchSubscription } from '../models/search-subscription.model';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  constructor(
    private progressDialog:ProgressDialogService,
    private app: AppService, private http: HttpClient) { }

  public addSubscription(subscription: Subscription) {
    this.progressDialog.show('Please Wait..');
    return this.http.post(this.app.endPoint + '/api/subscription/add',
    subscription,
      this.app.httpHeader
    ).pipe(
      map((response: ApiResponse) => {
        this.progressDialog.hide();
        console.log(response);
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

  public addSearchSubscription(searchSubscription: SearchSubscription) {
    this.progressDialog.show('Please Wait..');
    return this.http.post(this.app.endPoint + '/api/subscription/search/add',
    searchSubscription,
      this.app.httpHeader
    ).pipe(
      map((response: ApiResponse) => {
        this.progressDialog.hide();
        console.log(response);
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
