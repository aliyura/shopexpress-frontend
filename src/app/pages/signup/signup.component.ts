import { UserRole } from './../../enum/user-role.enum';
import { AccountType } from './../../enum/account-type.enum';
import { List } from './../../types/list.type';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppCluster } from 'src/app/app.shared.cluster';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogHandlerService } from 'src/app/services/dialog-handler.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';
import { Location } from 'src/app/models/location.model';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  form: FormValidator;
  user: User;
  locations: List<Location>;

  constructor(
    private app: AppCluster,
    private router: Router,
    private storage: StorageService,
    private titleService: Title,
    private locationService: LocationService,
    private authService: AuthenticationService,
    private notification: NotificationService
  ) {
    this.form = new FormValidator(User, 'form');
  }

  async getLocations() {
    this.locationService.getLocations().subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          console.log(response);
          if (response.payload != null)
            //store in session storegae
            this.storage.saveSession(
              Store.LOCATIONS,
              JSON.stringify(response.payload)
            );
          this.locations = response.payload;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public loadLocations() {
    try {
      var locations = this.storage.get(Store.LOCATIONS);
      if (locations != null) {
        this.locations = JSON.parse(locations);
      }
      else {
        this.getLocations();
      }
    } catch (ex) {
      console.log(ex);
      this.getLocations();

      console.log('Unable to convert locations to JSON');
    }
  }

  async signUp() {
    this.form.revalidate();
    let response = this.form.response;
    this.user = this.form.data;

    if (
      response['name'].ok &&
      response['email'].ok &&
      response['mobile'].ok &&
      response['country'].ok &&
      response['city'].ok &&
      response['gender'].ok &&
      response['password'].ok &&
      response['confirmPassword'].ok
    ) {
      if (this.user.password != this.user.confirmPassword) {
        this.notification.notifyWarning('Password & Confirm Password Mismatch');
      } else if (!this.app.validEmail(this.user.email)) {
        this.notification.notifyWarning('Invalid Email Address');
      } else if (!this.app.validMobile(this.user.mobile)) {
        this.notification.notifyWarning('Invalid Mobile Number');
      } else {
        delete this.user.confirmPassword;
        //format mobile number
        if (!this.user.mobile.startsWith('+234')) {
          if (this.user.mobile.startsWith('0'))
            this.user.mobile = this.user.mobile.replace(/^0/, '+234');
          else this.user.mobile = '+234' + this.user.mobile;
        }

        this.user.accountType = AccountType.INDIVIDUAL;
        this.user.role = UserRole.BUYER;

        this.authService.signUp(this.user).subscribe(
          (response: ApiResponse) => {
            if (response.success) {
              this.storage.save(Store.USER, JSON.stringify(response.payload));
              this.router.navigate(['/verify-account']);
            } else {
              this.notification.notifyError(response.message);
            }
          },
          (err) => {
            console.log(err);
            this.notification.notifyError('Unable to create your Account!');
          }
        );
      }
    } else {
      this.notification.notifyWarning('Oops! Form not filled correctly');
    }
  }

  ngOnInit(): void {
    this.loadLocations();
    this.titleService.setTitle('Create your new shopExpress Account');
  }
}
