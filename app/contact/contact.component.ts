import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Email from 'nativescript-email';
import * as TNSPhone from 'nativescript-phone';

@Component({
  selector: 'app-menu',
  moduleId: module.id,
  templateUrl: './contact.component.html'//,
  //styleUrls: ['./menu.component.css']
})
export class ContactComponent extends DrawerPage implements OnInit {

  constructor(
    private changeDetectorRef:ChangeDetectorRef,
    private fonticon: TNSFontIconService,
    @Inject('BaseURL') private BaseURL) {
      super(changeDetectorRef);
    }
  
  ngOnInit() {
  }

  callRestaurant() {
     TNSPhone.dial('852-1234-5678', true);
  }

  sendEmail() {
    Email.available()
    .then((avail: boolean) => {
      if (avail) {
        Email.compose({
          to: ['confusion@food.net'],
          subject: '[ConFusion]: Query',
          body: 'Dear Sir/Madam:'
        });
      }
      else {
        console.log('No Email Configured');
      }
    })
  }
}