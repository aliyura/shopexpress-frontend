import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppCluster } from 'src/app/app.shared.cluster';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  form: FormValidator;
  user: User;
  userInfo:any;
  locations:any;
  constructor(
    private app: AppCluster,
    private router: Router,
    private titleService:Title,
    private storage: StorageService,
    private authService: AuthenticationService,
    private notification: NotificationService
  ) {
    this.form = new FormValidator(User, 'form');
  }

  async updateProfile() {
    this.form.revalidate();
    let response = this.form.response;
    this.user = this.form.data;

    if (
      response['name'].ok &&
      response['email'].ok &&
      response['mobile'].ok &&
      response['country'].ok &&
      response['city'].ok &&
      response['gender'].ok 
      // &&
      // response['password'].ok &&
      // response['confirmPassword'].ok
    ) {
      // if (this.user.password != this.user.confirmPassword) {
      //   this.notification.notifyWarning('Password & Confirm Password Mismatch');
      // } else 
      if (!this.app.validEmail(this.user.email)) {
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

        this.authService.updateProfile(this.user.id, this.user).subscribe(
          (response: ApiResponse) => {
            if (response.success) {
              this.notification.notifySuccess(response.message);
            } else {
              this.notification.notifyError(response.message);
            }
          },
          (err) => {
            console.log(err);
            this.notification.notifyError('Unable to update your Account!');
          }
        );

      }
    } else {
      this.notification.notifyWarning('Oops! Form not filled correctly');
    }
  }

  ngOnInit(): void {
    this.userInfo=JSON.parse(this.storage.get(Store.USER));
    this.locations = JSON.parse(this.storage.get(Store.LOCATIONS));
    this.titleService.setTitle('Update your Account');
  }

}
