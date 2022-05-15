import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AppService } from './app.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private http:HttpClient,
    private app:AppService,
    private storage:StorageService) { }

  // getting all product
  public searchProducts(searchquery:any,page:number) {//+environment.pageSize
    return this.http.get(this.app.endPoint+ '/api/product/search?q='+searchquery+'&page='+page+'&size='+environment.pageSize, this.app.httpHeader).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError((error) => {
        let errorMessage = error.message !== undefined ? error.message : error.statusText;
        console.log(errorMessage);
        return throwError("Something Went Wrong");
      }))
  }
}
