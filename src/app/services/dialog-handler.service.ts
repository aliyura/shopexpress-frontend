
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { WarningModalAlert } from '../components/dialogs/warning-modal.alert';
import { ConfirmationModalAlert } from '../components/dialogs/confirmation-modal.alert';

@Injectable({
  providedIn: 'root',
})
export class DialogHandlerService {
  modalSize = 320;
  constructor(private snackbar: MatSnackBar, private dialog: MatDialog) {
    if (window.screen.width < 600) this.modalSize = 300;
    else this.modalSize = window.screen.width / 2.5;
  }

  handleError(error) {
    console.error(error);
    this.snackbar.open(error, 'close', { duration: 1000 });
  }
  displayWarning(title: string, body: string) {
    this.dialog.open(WarningModalAlert, {
      width: this.modalSize + 'px',
      data: {
        title: title,
        body: body,
      },
      // disableClose: true,
    });
  }

  requestConfirmation(title, body, callback) {
    this.dialog.open(ConfirmationModalAlert, {
      width: this.modalSize + 'px',
      data: {
        title: title,
        body: body,
        callback: callback,
      },
    });
  }
}
