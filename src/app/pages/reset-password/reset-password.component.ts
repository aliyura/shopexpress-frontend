import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppCluster } from 'src/app/app.shared.cluster';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { UserRequest } from 'src/app/models/user-request.model';
import { NotificationService } from 'src/app/services/notification.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormValidator;
  app: AppCluster;
  request: UserRequest;

  constructor(
    private titleService: Title,
    private notification: NotificationService
  ) {
    this.form = new FormValidator(UserRequest, 'form');
  }

  async verifyAccount() {
    this.form.revalidate();
    let response = this.form.response;
    this.request = this.form.data;

    if (response['username'].ok && response['password'].ok) {
      console.log('Hello');
    } else {
      this.notification.showNotification({
        type: NotificationType.warning,
        message: 'Oops! form not filled correctly',
      });
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Reset your herb.ng Password');
  }
}
