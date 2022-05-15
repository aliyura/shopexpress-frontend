import { Component, OnInit } from '@angular/core';
import { CategoryType } from 'src/app/enum/category-type.enum';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { Subscription } from 'src/app/models/subscription.model';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  categories: any;
  isMobile: boolean = false;
  form: FormValidator;
  savedSubscription:Subscription

  constructor(
    private storage: StorageService,
    private notificationService:NotificationService,
    private categoryService:CategoryService,
    private subscriptionService:SubscriptionService) {
      this.form = new FormValidator(Subscription, 'subscriptionForm');
    }

    async getCategories() {
      this.categoryService.getCategoriesByType(CategoryType.PRODUCT).subscribe(
        (response: ApiResponse) => {
          if (response.success) {
            if (response.payload != null)
              //store in session storage
              this.storage.save(Store.CATEGORY, JSON.stringify(response.payload));
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

    public loadCategories() {
      try {
        var categories = this.storage.get(Store.CATEGORY);
        if (categories != null) {
          this.categories = JSON.parse(categories);
        }else{
          this.getCategories();
        }
      } catch (ex) {
        console.log(ex);
        console.log('Unable to convert categories to JSON');
      }
    }


  addSubscription() {
    this.form.revalidate();
    let response = this.form.response;
    var subscription = this.form.data as Subscription;
    if (response['contact'].ok) {
      subscription.name=subscription.contact;
      this.subscriptionService.addSubscription(subscription).subscribe(
        (response: ApiResponse) => {
          if (response.success) {
              this.savedSubscription=response.payload as Subscription
          }else{
            this.notificationService.notifyError("Unable to save your Search notification request!")
          }
        })
    }
  }
  ngOnInit(): void {
    if (location.href.match(/req=app/))
      this.storage.save(Store.USERAGENT, 'MOBILE');

    if (this.storage.get(Store.USERAGENT) != null) this.isMobile = true;
    else this.isMobile = false;

    this.loadCategories();
  }
}
