import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.alert.html',
  styleUrls: ['./warning-modal.alert.css']
})
export class WarningModalAlert implements OnInit {
  title: any
  body: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<WarningModalAlert>) {
    this.title = data.title
    this.body = data.body
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
