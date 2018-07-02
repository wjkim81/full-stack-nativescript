import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";

import { Page } from "ui/page";
import { View } from "ui/core/view";
import * as enums from "ui/enums";

import { CouchbaseService } from '../services/couchbase.service';


@Component({
  selector: 'app-reservation',
  moduleId: module.id,
  templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

  reservation: FormGroup;
  reservationForm: View;
  reservationResult: View;
  showForm: boolean = true;

  docId: string = "reservations";
  reservations: any[];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: ModalDialogService,
    private vcRef: ViewContainerRef,
    private page: Page,
    private couchbaseService: CouchbaseService) {
      super(changeDetectorRef);

      this.reservation = this.formBuilder.group({
        guests: 3,
        smoking: false,
        dateTime: ['', Validators.required]
      });

      this.reservations = [];
  }

  ngOnInit() {

  }

  onSmokingChecked(args) {
    let smokingSwitch = <Switch>args.object;
    if (smokingSwitch.checked) {
      this.reservation.patchValue({ smoking: true });
    }
    else {
      this.reservation.patchValue({ smoking: false });
    }
  }

  onGuestChange(args) {
    let textField = <TextField>args.object;

    this.reservation.patchValue({ guests: textField.text});
  }

  onDateTimeChange(args) {
    let textField = <TextField>args.object;

    this.reservation.patchValue({ dateTime: textField.text});
  }

  onSubmit() {
    console.log(JSON.stringify(this.reservation.value));
    this.saveReservation(this.reservation.value);

    this.reservationForm = this.page.getViewById<View>('reservationForm');
    this.reservationResult = this.page.getViewById<View>('reservationResult');

    this.reservationForm.animate({
      scale: { x: 0, y: 0 },
      opacity: 0,
      duration: 5000
    })
    .then(() => {
      this.showForm = false;
      this.reservationResult.animate({
        scale: { x: 0, y: 0 },
        opacity: 0,
        duration: 0
      })
      .then(() => {
        this.reservationResult.animate({
          scale: { x: 1.0, y: 1.0 },
          opacity: 1,
          duration: 5000
        })
      });
    })
  }

  createModalView(args) {

    let options: ModalDialogOptions = {
        viewContainerRef: this.vcRef,
        context: args,
        fullscreen: false
    };

    this.modalService.showModal(ReservationModalComponent, options)
      .then((result: any) => {
        if (args === "guest") {
            this.reservation.patchValue({guests: result});
        }
        else if (args === "date-time") {
            this.reservation.patchValue({ dateTime: result});
        }
    });
  }

  saveReservation(reservation: any) {
    console.log("reservations: " + this.reservations);
    console.log("saveReservation: ")
    console.log(reservation);

    let doc = this.couchbaseService.getDocument(this.docId);
    if (doc == null) {
      this.couchbaseService.createDocument({"reservations": []}, this.docId);
    }
    else {
      this.reservations = doc.reservations;
    }

    this.reservations.push(reservation);
    this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});
    console.log("doc.reservations: ");
    console.log(doc);
  }
}