import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs';
import { SuccessDialogComponent } from '../dialogs/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {

  constructor(private matDialog: MatDialog) { }

  openSuccessDialog(message: string): Observable<boolean>{
    const dialogRef = this.matDialog.open(SuccessDialogComponent, {
      width: '400',
      data: {message}
    });

    return dialogRef.afterClosed();
  }

  openErrorDialog(message: string): Observable<boolean>{
    const dialogRef = this.matDialog.open(ErrorDialogComponent, {
      width: '500',
      data: {message}
    });

    return dialogRef.afterClosed();
  }
}
