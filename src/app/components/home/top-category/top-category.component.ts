import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from 'src/app/enum/store.enum';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-top-category',
  templateUrl: './top-category.component.html',
  styleUrls: ['./top-category.component.css'],
})
export class TopCategoryComponent implements OnInit {
  categories: any;
  isLoading: boolean = true;

  constructor(private storage: StorageService) {}

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
  }
}
