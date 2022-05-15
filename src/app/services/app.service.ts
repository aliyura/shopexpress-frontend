import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from '../enum/store.enum';
import { ApiResponse } from '../models/api-response.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  endPoint = environment.endPoint;

  constructor(
    private http:HttpClient,
    private store: StorageService) { }

  get httpAutherizedHeader() {
    console.log( this.store.get(Store.TOKEN))
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: "Bearer "+this.store.get(Store.TOKEN),
      }),
    };
    return httpOptions;
  }

  get httpHeader() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return httpOptions;
  }


  public ping() {
    return this.http
      .get(
        this.endPoint + '/api/ping',
        this.httpHeader
      )
      .pipe(map((response: ApiResponse) => {
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
