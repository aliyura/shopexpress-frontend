import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppCluster } from 'src/app/app.shared.cluster';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { UserRequest } from 'src/app/models/user-request.model';
import { UserVerificationRequest } from 'src/app/models/user-verification-request.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css'],
})
export class VerifyAccountComponent implements OnInit {
  form: FormValidator;
  app: AppCluster;
  user: User;
  userVerificationRequest=new UserVerificationRequest();
  userRequest=new UserRequest();


  constructor(
    private storage: StorageService,
    private router: Router,
    private titleService:Title,
    private authService: AuthenticationService,
    private notification: NotificationService
  ) {
    this.form = new FormValidator(UserVerificationRequest, 'form');
  }

  async getUser() {
    var user = this.storage.get(Store.USER);
    if (user != null) {
      this.user = JSON.parse(user);
      this.userRequest.username = this.user.mobile;
      this.userVerificationRequest.username = this.user.mobile;
    }
  }

  async verifyAccount() {
    this.form.revalidate();
    let response = this.form.response;
    this.userVerificationRequest = this.form.data;

    if (response['username'].ok) {
      if (response['otp'].ok) {
        if (this.userVerificationRequest.otp.toString().length < 6) {
          this.notification.notifyWarning('Invalid OTP');
        } else {
          this.authService
            .verifyAccount(this.userVerificationRequest)
            .subscribe(
              (response: ApiResponse) => {
                if (response.success) this.router.navigate(['/login']);
                else this.notification.notifyError(response.message);
              },
              (err) => {
                this.notification.notifyError(err);
              }
            );
        }
      } else {
        this.notification.notifyWarning('Enter your OTP');
      }
    } else {
      this.notification.notifyWarning('Enter your username');
    }
  }

  async resendOTP() {
    if (this.userRequest.username != null) {
      var userRequest = new UserRequest();
      userRequest.username = this.userRequest.username;

      this.authService.sendOTP(userRequest).subscribe(
        (response: ApiResponse) => {
          if (response.success)
            this.notification.notifySuccess('Sent Successfully');
          else this.notification.notifyError(response.message);
        },
        (err) => {
          this.notification.notifyError(err);
        }
      );
    } else {
      this.notification.notifyWarning('Enter your username');
    }
  }

  ngOnInit(): void {
    this.getUser();
    this.titleService.setTitle('Verify your Account');
  }
}
