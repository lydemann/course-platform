import { Injectable } from '@angular/core';
import { DialogComponent, DialogData } from './dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog) {}

  private readonly defaultDialogData = {
    title: 'Are you sure?',
    message: 'This action cannot be undone',
    cancelBtnText: 'No',
    okBtnText: 'Yes',
  };

  openDialog(
    onConfirm: () => void,
    data: DialogData = this.defaultDialogData,
    onCancel: () => void = () => {}
  ) {
    const dialogRef = this.dialog.open<DialogComponent, DialogData>(
      DialogComponent,
      {
        data,
      }
    );

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        onConfirm();
      } else {
        onCancel();
      }
    });
  }
}
