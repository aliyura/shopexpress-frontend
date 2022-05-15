import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.alert.html',
  styleUrls: ['./confirmation-modal.alert.css']
})
export class ConfirmationModalAlert implements OnInit {
  title: any
  body: any
  callback: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmationModalAlert>) {
    this.title = data.title
    this.body = data.body
    this.callback = data.callback
  }

  closeDialog() {
    this.dialogRef.close();
  }
  call(state){
      this.closeDialog();
      this.callback(state)
  }

  ngOnInit(): void {
  }

}
