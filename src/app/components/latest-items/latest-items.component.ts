import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-latest-items',
  templateUrl: './latest-items.component.html',
  styleUrls: ['./latest-items.component.css'],
})
export class LatestItemsComponent implements OnInit {
  latestItems: any;
  isLoading: boolean = true;

  constructor(
    public app:AppCluster,
    private products: ProductService) { }
  
  
  setDefault(e) {
      e.target.src = 'assets/images/notFound.jpg';
  }
  async getLatestItems() {
    this.isLoading = true;
    this.products.getAllProducts(0).subscribe((response: ApiResponse) => {
      this.isLoading = false;
      if (response.success) {
        this.latestItems = response.payload.content;
      }
    }, (err)=>{
        this.isLoading = false;
    });
  }
  ngOnInit(): void {
    this.getLatestItems();
  }
}
