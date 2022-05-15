import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/enum/store.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from 'src/app/services/storage.service';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryType } from 'src/app/enum/category-type.enum';
import { ApiResponse } from 'src/app/models/api-response.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  categories: any;
  isLoading: boolean = true;

  authenticated: boolean;
  constructor(
    public app:AppCluster,
    private storage: StorageService,
    private authService: AuthenticationService,
    private categoryService:CategoryService
  ) {}


  async getCategories() {
    this.categoryService.getCategoriesByType(CategoryType.PRODUCT).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          this.categories = response.payload;
          if (response.payload != null)
            this.storage.save(Store.CATEGORY, JSON.stringify(response.payload));
        }
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public loadCategories() {
    try {
      this.isLoading = true;
      var categories = this.storage.get(Store.CATEGORY);
      if (categories != null) {
        this.categories = JSON.parse(categories);
        this.isLoading = false;
      }else{
        this.getCategories();
      }
    } catch (ex) {
      console.log(ex);
      console.log('Unable to convert categories to JSON');
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.authenticated = this.authService.isAuthenticated;
  }
}
