import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from 'src/app/enum/store.enum';
import { ApiResponse } from 'src/app/models/api-response.model';
import { UserRequest } from 'src/app/models/user-request.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CardsService } from 'src/app/services/cards.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';

@Component({
  selector: 'app-activate-card',
  templateUrl: './activate-card.component.html',
  styleUrls: ['./activate-card.component.css']
})
export class ActivateCardComponent implements OnInit {

  form: FormValidator;
  authorized:any;
  userRequest = new UserRequest();
  constructor(private notification:NotificationService,
    private storage:StorageService,
    private router: Router,
    private titleService:Title,
    private cardService: CardsService,
    private authService:AuthenticationService) { }

    activateCard(vals)
    {
      var serial=vals.serial;
      var pin=vals.pin;

      if(serial!="" && pin!="")
      {
        this.notification.notifyWarning('Loading, Please wait..')
        this.cardService.cardActivation(serial,pin).subscribe((response:ApiResponse)=>{
          if(response.success)
          {
            this.notification.notifySuccess(response.message);
          }
          else
          {
            this.notification.notifyError(response.message);
          }
        })
      }
      else
      {
        this.notification.notifyError("Fields Cannot Be Empty");
      }
    }


  ngOnInit(): void {
    this.authorized = this.authService.isAuthenticated;
    this.titleService.setTitle('Activate your shopExpress card and start shopping now');
  }

}
