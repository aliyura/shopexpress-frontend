import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/api-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(
    private app:AppService,
    private http: HttpClient
  ) {}
  

  public getAllCategories() {
    return this.http.get(this.app.endPoint+ '/api/category/get_all', this.app.httpHeader).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError((error) => {
        let errorMessage = error.message !== undefined ? error.message : error.statusText;
        console.log(errorMessage);
        return throwError("Something Went Wrong");
      }))
  }

  public getCategoriesByType(type:string) {
    return this.http.get(this.app.endPoint+ '/api/category/get_by_type/' + type, this.app.httpHeader).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError((error) => {
        let errorMessage = error.message !== undefined ? error.message : error.statusText;
        console.log(errorMessage);
        return throwError("Something Went Wrong");
      }))
  }

  public getCategoryById(id:number) {
    return this.http.get(this.app.endPoint+ '/api/category/get_by_id/' + id, this.app.httpHeader).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError((error) => {
        let errorMessage = error.message !== undefined ? error.message : error.statusText;
        console.log(errorMessage);
        return throwError("Something Went Wrong");
      }))
  }

  public getCategoryByName(name:string) {
    return this.http.get(this.app.endPoint+ '/api/category/get_by_name/' + name, this.app.httpHeader).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError((error) => {
        let errorMessage = error.message !== undefined ? error.message : error.statusText;
        console.log(errorMessage);
        return throwError("Something Went Wrong");
      }))
  }

  public getAllSubCategories() {
    return this.http.get(this.app.endPoint+ '/api/sub_category/get_all', this.app.httpHeader).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError((error) => {
        let errorMessage = error.message !== undefined ? error.message : error.statusText;
        console.log(errorMessage);
        return throwError("Something Went Wrong");
      }))
  }

  public getSubCategoriesByCategoryId(categoryId:number) {
    return this.http.get(this.app.endPoint+ '/api/sub_category/get_by_category_id/' + categoryId, this.app.httpHeader).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError((error) => {
        let errorMessage = error.message !== undefined ? error.message : error.statusText;
        console.log(errorMessage);
        return throwError("Something Went Wrong");
      }))
  }

  public getSubCategoryById(id:number) {
    return this.http.get(this.app.endPoint+ '/api/sub_category/get_by_id/' + id, this.app.httpHeader).pipe(
      map((response: ApiResponse) => {
        return response;
      }),
      catchError((error) => {
        let errorMessage = error.message !== undefined ? error.message : error.statusText;
        console.log(errorMessage);
        return throwError("Something Went Wrong");
      }))
  }

  public getSubCategoryByName(name:string) {
    return this.http.get(this.app.endPoint+ '/api/sub_category/get_by_name/' + name, this.app.httpHeader).pipe(
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