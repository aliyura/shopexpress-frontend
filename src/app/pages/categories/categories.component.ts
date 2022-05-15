import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from 'src/app/enum/store.enum';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: any;
  isLoading: boolean = true;

  constructor(
    private titleService:Title,
    private storage: StorageService) { }

  public loadCategories() {
    try {
      this.isLoading = true;
      var categories = this.storage.get(Store.CATEGORY);
      if (categories != null) {
        this.isLoading = false;
        this.categories = JSON.parse(categories);
      }
    } catch (ex) {
      console.log(ex);
      console.log('Unable to convert categories to JSON');
    }
  }
  ngOnInit(): void {
    this.loadCategories();
    this.titleService.setTitle('All Categories');
  }
}