import { ProgressDialogService } from './progress-dialog.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(
    private app: AppService,
    private progressDialog:ProgressDialogService,
    private http: HttpClient) { }
// Card Activation
  public cardActivation(serial: string, pin: string) {
     this.progressDialog.show();
    return this.http.post(this.app.endPoint+ '/api/card/activation?serial='+serial+'&pin='+pin, "",this.app.httpAutherizedHeader).pipe(
      map((response: ApiResponse) => {
         this.progressDialog.hide();
        return response;
      }),
      catchError((error) => {
         this.progressDialog.hide();
        let errorMessage = error.message !== undefined ? error.message : error.statusText;
        console.log(errorMessage)
        return throwError("Something Went Wrong");

      }))
  }
  // Card Balance
  public cardBalance(serial: string, pin: string) {
       this.progressDialog.show();
      return this.http.post(this.app.endPoint+ '/api/card/balance/inquiry?serial='+serial+'&pin='+pin, "",this.app.httpAutherizedHeader).pipe(
        map((response: ApiResponse) => {
           this.progressDialog.hide();
          return response;
        }),
        catchError((error) => {
           this.progressDialog.hide();
          let errorMessage = error.message !== undefined ? error.message : error.statusText;
          console.log(errorMessage)
          return throwError("Something Went Wrong");
  
        }))
    }
}
