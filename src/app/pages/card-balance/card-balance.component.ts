import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/api-response.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CardsService } from 'src/app/services/cards.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/validators/form-custom.validator';

@Component({
  selector: 'app-card-balance',
  templateUrl: './card-balance.component.html',
  styleUrls: ['./card-balance.component.css']
})
export class CardBalanceComponent implements OnInit {
  form: FormValidator;
  authorized:any;
  cardBalance:any;
  cardRate:any;
  cardSpent:any;
  constructor(private notification:NotificationService,
    private storage: StorageService,
    private titleService:Title,
    private router:Router,
    private cardService: CardsService,
    private authService:AuthenticationService) { }

    async myCardBalance(vals)
    {
      this.cardBalance=null;
      var serial=vals.serial;
      var pin=vals.pin;

      if(serial!="" && pin!="")
      {
        this.cardService.cardBalance(serial,pin).subscribe((response:ApiResponse)=>{
          if(response.success)
          {
            this.notification.notifySuccess(response.message);
            this.cardBalance=response.payload.amount;
            this.cardRate=response.payload.rate;
            this.cardSpent=response.payload.spentAmount;
          }
          else
          {
            this.notification.notifyError(response.message);
          }
        }, (err) => {
          console.log(err);
        })
      }
      else
      {
        this.notification.notifyError("Fields Cannot Be Empty");
      }
    }

  ngOnInit(): void {
    this.authorized=this.authService.isAuthenticated;
    if(!this.authorized)
    {
      this.router.navigate(['/login'])
    }
    this.titleService.setTitle('Check your shopExpress card balance');
  }

}
