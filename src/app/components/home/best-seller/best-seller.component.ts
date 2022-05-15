import { Category } from './../../../models/category.model';
import { CategoryResponse } from './../../../models/category-response.model';
import { StorageService } from 'src/app/services/storage.service';
import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response.model';
import { ProductService } from 'src/app/services/product.service';
import { Store } from 'src/app/enum/store.enum';
import { List } from 'src/app/types/list.type';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css'],
})
export class BestSellerComponent implements OnInit {
  constructor(
    public app: AppCluster,
    private storage: StorageService,
    private products: ProductService
  ) {}

  productList: any;
  categories: List<CategoryResponse>;
  currentPage: number = 0;
  currentCategory: Category;
  isLoading: boolean = true;

  setDefault(e) {
    e.target.src = 'assets/images/notFound.jpg';
  }

  public loadCategories() {
    try {
      var categories = this.storage.get(Store.CATEGORY);
      if (categories != null) {
        this.categories = JSON.parse(categories);
        this.currentCategory = this.categories[10].category;
        this.getProducts(this.currentCategory.id);
      }
    } catch (ex) {
      console.log('Unable to convert categories to JSON');
    }
  }

  async getProducts(categoryId) {
    this.isLoading = true;
    this.productList = null;
    this.products.getProductsByCategory(this.currentPage, categoryId).subscribe(
      (response: ApiResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.productList = response.payload.content;
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  loadItems(category: Category, e) {
    document.querySelectorAll('.category-list li a')
      .forEach((el) => {
        el.classList.remove('active');
      });
    e.target.classList.add('active');

    this.currentCategory = category;
    this.getProducts(category.id);
  }
  ngOnInit(): void {
    this.loadCategories();
  }
}
