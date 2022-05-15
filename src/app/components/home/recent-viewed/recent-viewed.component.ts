import { AuthenticationService } from 'src/app/services/authentication.service';
import { AppCluster } from 'src/app/app.shared.cluster';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/api-response.model';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recent-viewed',
  templateUrl: './recent-viewed.component.html',
  styleUrls: ['./recent-viewed.component.css'],
})
export class RecentViewedComponent implements OnInit {
  recentItems: any;
  itemsData:any
  percentage: number;
  isLoading: boolean = true;
  isMoreLoading: boolean = false;
  curentPage: number = 0;
  scrollCheck: boolean = false;

  constructor(
    public app: AppCluster,
    private auth: AuthenticationService,
    private products: ProductService
  ) {}

  setDefault(e) {
    e.target.src = 'assets/images/notFound.jpg';
  }
  async recentViewed() {
    if (this.curentPage > 0) this.isMoreLoading = true;
    else this.isLoading = true;
    this.products.getRecentylyViewed(this.curentPage).subscribe(
      (response: ApiResponse) => {
        this.isLoading = false;
        this.isMoreLoading = false;
        if (response.success) {
          this.itemsData = response.payload;
          if (this.curentPage == 0) this.recentItems = response.payload.content;
          else if (response.payload.content.length > 0)
            Array.prototype.push.apply(
              this.recentItems,
              response.payload.content
            );
        }
      },
      (err) => {
        this.isLoading = false;
        this.isMoreLoading = false;
      }
    );
  }

  onScroll() {
    if (!this.isMoreLoading) {
      if (this.itemsData != null) {
        if (this.curentPage < this.itemsData['totalPages'] - 1) {
          this.scrollCheck = true;
          this.curentPage = this.curentPage + 1;
          this.recentViewed();
          console.log('scrolled');
        }
      }
    }
  }
  ngOnInit(): void {
    if (this.auth.isAuthenticated) this.recentViewed();
    else this.isLoading = false;

    this.percentage = environment.percentage;
  }
}
